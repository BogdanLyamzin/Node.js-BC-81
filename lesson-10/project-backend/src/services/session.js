import { randomUUID } from 'node:crypto';

import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/auth.constants.js';

import Session from '../db/models/Session.js';

const {NODE_ENV} = process.env;

const isProd = NODE_ENV === "production";

export const createSession = userId => Session.create({
    userId,
    accessToken: randomUUID(),
    refreshToken: randomUUID(),
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
  });

export const setSessionCookies = ({res, session})=> {
  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'none',
    maxAge: accessTokenLifeTime,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'none',
    maxAge: refreshTokenLifeTime,
  });

    res.cookie("sessionId", session._id, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'none',
    maxAge: refreshTokenLifeTime,
  });
}
