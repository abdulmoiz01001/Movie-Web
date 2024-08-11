const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema
const userSchema = new Schema({
    profileImg:{
        type:String
    },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      
      createdAt: {
        type: Date,
        default: Date.now
      },
    updatedNow:{
        type:Date,
        default:Date.now
    }

}
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (err) {
      next(err);
  }
});
const User = mongoose.model('User',userSchema)
module.exports = User