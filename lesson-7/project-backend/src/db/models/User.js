import {Schema, model} from "mongoose";

import { emailRegexp } from '../../constants/index.js';

import { setUpdateSettings } from '../mongoose.hooks.js';

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: [true, "email must be exist"],
  },
  password: {
    type: String,
    required: true,
  }
}, {versionKey: false, timestamps: true});

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.pre("save", function() {
  if(!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
}

const User = model("User", userSchema);

export default User;
