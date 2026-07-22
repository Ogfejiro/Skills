// scripts/sendAttendeeReminderEmails.js
//
// Reads the attendees CSV, extracts every attendee email, uses body.txt as the
// email body, and sends a reminder email to each attendee via sendCustomHostEmail
// (Brevo API). Emails are de-duplicated and sent in throttled chunks so we don't
// trip Brevo's rate limits or fail the whole run if one send errors.
//
// Usage:
//   node scripts/sendAttendeeReminderEmails.js --dry-run   # parse + preview, send nothing
//   node scripts/sendAttendeeReminderEmails.js             # live send
//
// Optional flags:
//   --csv=<path>        override CSV path
//   --body=<path>       override body text file path
//   --chunk=<n>         emails per chunk        (default 10)
//   --delay=<ms>        pause between chunks     (default 1500)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { sendCustomHostEmail } from '../src/services/shared/sendVerificationEmail.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_ROOT = path.resolve(__dirname, '..')

// --- config / flags ---------------------------------------------------------
const DRY_RUN = process.argv.includes('--dry-run')

function flag(name, fallback) {
	const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
	return hit ? hit.split('=')[1] : fallback
}

const CSV_PATH = path.resolve(
	BACKEND_ROOT,
	flag('csv', 'attendees_ties_web3_onboarding_event 3.csv'),
)
const BODY_PATH = path.resolve(BACKEND_ROOT, flag('body', 'body.txt'))
const CHUNK_SIZE = parseInt(flag('chunk', '10'), 10)
const CHUNK_DELAY_MS = parseInt(flag('delay', '1500'), 10)

const SUBJECT = 'Only 2 days to go — TIES DAO Web3 Onboarding 2026 💛'
const HOST_NAME = 'The TIES Team'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- CSV parsing -------------------------------------------------------------
// Minimal parser for the simple quoted CSV format in this file
// (no embedded commas/newlines inside the email column).
function parseCsvLine(line) {
	const fields = []
	let cur = ''
	let inQuotes = false
	for (let i = 0; i < line.length; i++) {
		const ch = line[i]
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				cur += '"'
				i++
			} else {
				inQuotes = !inQuotes
			}
		} else if (ch === ',' && !inQuotes) {
			fields.push(cur)
			cur = ''
		} else {
			cur += ch
		}
	}
	fields.push(cur)
	return fields.map((f) => f.trim())
}

function extractEmails(csvText) {
	const lines = csvText
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean)

	if (lines.length === 0) return []

	const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase())
	let emailIdx = header.findIndex((h) => h.includes('email'))
	if (emailIdx === -1) emailIdx = 1 // fallback: "Attendee Email" is column 2

	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const seen = new Set()
	const emails = []

	for (let i = 1; i < lines.length; i++) {
		const cols = parseCsvLine(lines[i])
		const raw = (cols[emailIdx] || '').trim()
		if (!raw) continue
		const email = raw.toLowerCase()
		if (!emailRe.test(email)) {
			console.warn(`  ⚠ row ${i + 1}: skipping invalid email "${raw}"`)
			continue
		}
		if (seen.has(email)) continue
		seen.add(email)
		emails.push(raw) // keep original casing for the actual send
	}
	return emails
}

// --- body.txt -> simple HTML -------------------------------------------------
function buildHtml(bodyText) {
	const escaped = bodyText
		.replace(/\r\n/g, '\n') // normalize Windows line endings first
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

	const paragraphs = escaped
		.split(/\n{2,}/) // blank line => new paragraph
		.map((p) => p.trim())
		.filter(Boolean)
		.map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
		.join('\n')

	return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #222;">
    ${paragraphs}
  </body>
</html>`
}

// --- main --------------------------------------------------------------------
async function run() {
	if (!fs.existsSync(CSV_PATH)) {
		console.error(`CSV not found: ${CSV_PATH}`)
		process.exit(1)
	}
	if (!fs.existsSync(BODY_PATH)) {
		console.error(`Body file not found: ${BODY_PATH}`)
		process.exit(1)
	}
	if (!DRY_RUN && (!process.env.BREVO_API_KEY || !process.env.EMAIL_FROM)) {
		console.error('BREVO_API_KEY and EMAIL_FROM must be set in .env for a live send.')
		process.exit(1)
	}

	const csvText = fs.readFileSync(CSV_PATH, 'utf8')
	const bodyText = fs.readFileSync(BODY_PATH, 'utf8')

	const emails = extractEmails(csvText)
	const htmlContent = buildHtml(bodyText)

	console.log(`Mode:      ${DRY_RUN ? 'DRY RUN (no emails sent)' : 'LIVE'}`)
	console.log(`CSV:       ${CSV_PATH}`)
	console.log(`Body:      ${BODY_PATH}`)
	console.log(`Subject:   ${SUBJECT}`)
	console.log(`Recipients: ${emails.length} unique email(s)`)
	console.log(`Chunking:  ${CHUNK_SIZE} per chunk, ${CHUNK_DELAY_MS}ms between chunks\n`)

	if (emails.length === 0) {
		console.error('No valid emails found — aborting.')
		process.exit(1)
	}

	if (DRY_RUN) {
		console.log('First few recipients:')
		emails.slice(0, 5).forEach((e) => console.log(`  - ${e}`))
		console.log('\n--- HTML preview ---\n')
		console.log(htmlContent)
		console.log('\nDry run complete. Re-run without --dry-run to send.')
		return
	}

	const results = { sent: 0, failed: 0, failures: [] }

	for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
		const chunk = emails.slice(i, i + CHUNK_SIZE)
		const chunkNo = Math.floor(i / CHUNK_SIZE) + 1
		const totalChunks = Math.ceil(emails.length / CHUNK_SIZE)
		console.log(`Chunk ${chunkNo}/${totalChunks} (${chunk.length} email(s))...`)

		// send the chunk concurrently, but wait for the whole chunk before the next
		const outcomes = await Promise.all(
			chunk.map(async (email) => {
				try {
					const r = await sendCustomHostEmail(
						email,
						SUBJECT,
						htmlContent,
						HOST_NAME,
					)
					if (r && r.success) return { email, ok: true }
					return { email, ok: false, error: r?.error || 'unknown error' }
				} catch (err) {
					return { email, ok: false, error: err.message }
				}
			}),
		)

		for (const o of outcomes) {
			if (o.ok) {
				results.sent++
				console.log(`  ✓ ${o.email}`)
			} else {
				results.failed++
				results.failures.push(o)
				console.log(`  ✗ ${o.email} — ${o.error}`)
			}
		}

		if (i + CHUNK_SIZE < emails.length) await sleep(CHUNK_DELAY_MS)
	}

	console.log(`\nDone. Sent: ${results.sent}, Failed: ${results.failed}`)
	if (results.failures.length) {
		console.log('\nFailed recipients (safe to re-run — Brevo dedups nothing, so filter these):')
		results.failures.forEach((f) => console.log(`  ${f.email} — ${f.error}`))
	}
}

run()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('Fatal error:', err)
		process.exit(1)
	})
