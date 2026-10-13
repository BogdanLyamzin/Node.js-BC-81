import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import Handlebars from 'handlebars';
import {resolve} from "node:path";
import {readFile} from "node:fs/promises";

import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

import { createSession, setSessionCookies } from '../services/session.js';
import sendEmail from "../services/sendEmail.js";

const templateVerifyEmailPath = resolve("src", "templates", "verify-email.html");
const templateVerifyEmailSource = await readFile(templateVerifyEmailPath, "utf-8");

const {BASE_URL, JWT_SECRET} = process.env;

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw createHttpError(409, 'Email already exist');

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  const token = jwt.sign({email}, JWT_SECRET, {expiresIn: "24h"});

  const template = Handlebars.compile(templateVerifyEmailSource);

  const html = template({
    username: newUser.username,
    link: `${BASE_URL}/auth/verify?token=${token}`
  })

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html,
  };

  await sendEmail(verifyEmail);

  res.status(201).json(newUser);
};

export const verifyUser = async(req, res)=> {
  const {token} = req.query;
  try {
    const {email} = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({email});
    if(!user) throw createHttpError(401, "User not found");
    if(user.verify) throw createHttpError(401, "User already verified");

    user.verify = true;
    await user.save();

    res.json({
      message: "Email successfully verified"
    })
  }
  catch(error) {
    throw createHttpError(401, error.message);
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  if(!user.verify) throw createHttpError(401, 'Email not verified');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw createHttpError(401, 'Email or password invalid');

  await Session.deleteOne({userId: user._id});

  const session = await createSession(user);

  setSessionCookies({ res, session });

  res.json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId } = req.cookies;
  const session = await Session.findById(sessionId);
  if (!session) throw createHttpError(401, 'Session not found');

  if (session.refreshTokenValidUntil < new Date())
    throw createHttpError(401, 'Refresh token expired');

  await Session.deleteOne({ _id: sessionId });

  const newSession = await createSession(session.userId);

  setSessionCookies({ res, session: newSession });

  res.json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async(req, res)=> {
  const {sessionId} = req.cookies;
  if(sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
}
