import mongoose from 'mongoose'

const hostSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    accountNo: {
      type: String,
      required: function () {
        return this.accountName
      },
    },
    accountName: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    walletType: {
      type: String,
    },
    walletSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

hostSchema.index({ hostId: 1 })

const HostProfile = mongoose.model('HostProfile', hostSchema)

export default HostProfile
