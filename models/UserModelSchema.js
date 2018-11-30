import mongoose from "mongoose"
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name fields is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password fields is required'],
    unique: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  avatar_url: String,
  email: String,
  followers: Number,
  following: Number,
  role: String,
  gender: String
})

const User = mongoose.model('User', UserSchema)

export default User
