import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {randomUUID} from "node:crypto";

import User from '../db/models/User.js';
import Session from "../db/models/Session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/auth.constants.js';

// const salt = await bcrypt.genSalt(10);
// console.log(salt);
// const hashStr = await bcrypt.hash("123456", 10);
// console.log(hashStr);
// const compareResult1 = await bcrypt.compare("123456", hashStr);
// console.log(compareResult1);
// const compareResult2 = await bcrypt.compare("123457", hashStr);
// console.log(compareResult2);

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw createHttpError(409, 'Email already exist');

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw createHttpError(401, 'Email or password invalid');

  const session = await Session.create({
    userId: user._id,
    accessToken: randomUUID(),
    refreshToken: randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
  });

  res.json(user);
};
