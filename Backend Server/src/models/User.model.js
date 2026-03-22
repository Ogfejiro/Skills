import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      toLowerCase: true,
    },

    password: {
      type: String,
      select: false,
    },

    phone: {
      type: String,
      unique: true,
      required: true,
    },

    refId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profession: {
      type: String,
    },
    role: {
      type: String,
      enum: ['User', 'Host', 'Admin'],
      default: 'User',
    },

    provider: {
      type: [String],
      enum: ['google', 'local'],
      default: ['local'],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })
userSchema.index({ role: 1 })

const User = mongoose.model('User', userSchema)

export default User
