import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: string,
    required: true,
    unique: true,
    trim: true,
    toLowerCase: true,
  },

  password: {
    type: string,
    minLenght: 6,
  },

  firstName: {
    type: string,
  },
  lastName: {
    type: string,
  },
  profession: {
    type: string,
  },
  role: {
    type: String,
    enum: ['User', 'Host', 'Admin'],
    default: 'User',
  },
})
