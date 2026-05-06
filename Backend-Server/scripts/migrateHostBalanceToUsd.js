import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Host from '../src/models/Host.model.js'

dotenv.config()

const DRY_RUN = process.argv.includes('--dry-run')

async function run() {
	if (!process.env.MONGODB_URI) {
		console.error('MONGODB_URI is not set')
		process.exit(1)
	}

	await mongoose.connect(process.env.MONGODB_URI)
	console.log(`Connected. Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)

	const hosts = await Host.find({
		$or: [
			{ balanceMigratedToUsd: { $exists: false } },
			{ balanceMigratedToUsd: false },
		],
	})

	console.log(`Found ${hosts.length} host(s) to migrate`)

	let migrated = 0
	let skipped = 0
	const skippedDetails = []

	for (const host of hosts) {
		const rate = host.conversionRate
		if (!rate || rate <= 0) {
			skipped++
			skippedDetails.push({
				hostId: host._id.toString(),
				reason: `Invalid conversionRate: ${rate}`,
			})
			continue
		}

		const oldBalance = host.balance || 0
		const oldRevenue = host.revenue || 0
		const newBalance = oldBalance / rate
		const newRevenue = oldRevenue / rate

		console.log(
			`Host ${host._id} | rate=${rate} | balance ${oldBalance} NGN → ${newBalance.toFixed(4)} USD | revenue ${oldRevenue} NGN → ${newRevenue.toFixed(4)} USD`,
		)

		if (!DRY_RUN) {
			await Host.updateOne(
				{ _id: host._id },
				{
					balance: newBalance,
					revenue: newRevenue,
					balanceMigratedToUsd: true,
				},
			)
		}
		migrated++
	}

	console.log('—'.repeat(40))
	console.log(`Migrated: ${migrated}`)
	console.log(`Skipped:  ${skipped}`)
	if (skippedDetails.length) {
		console.log('Skipped details:', skippedDetails)
	}
	if (DRY_RUN) {
		console.log('DRY RUN — no documents were written')
	}

	await mongoose.disconnect()
}

run().catch(async (err) => {
	console.error('Migration failed:', err)
	await mongoose.disconnect().catch(() => {})
	process.exit(1)
})
