import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

import { createSession, setSessionCookies } from '../services/session.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw createHttpError(409, 'Email already exist');

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  const session = await createSession(newUser);

  setSessionCookies({ res, session });

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

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
