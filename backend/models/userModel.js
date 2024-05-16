const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true },
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: { type: Boolean, default: false, required: true },
    photos: {type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 10'] }
  },
  {
    timestamps: true,
  }
)

function arrayLimit(val){
  return val.length <= 10;
}

userSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password, this.password)
}

// Mongoose middleware .pre() hashes the password on new users
userSchema.pre('save', async function (next){
  if(!this.isModified('password')){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;