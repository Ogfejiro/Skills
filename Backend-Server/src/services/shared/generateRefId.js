import User from '../../models/User.model.js'

export async function generateRefId() {
  let refId
  let exists = true

  while (exists) {
    const randomNum = Math.floor(100000 + Math.random() * 900000) // 6-digit
    refId = `LOFTE-${randomNum}`

    const doc = await User.findOne({ refId })
    if (!doc) {
      exists = false
    }
  }

  return refId
}
