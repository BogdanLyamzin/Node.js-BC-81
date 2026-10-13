import { Segments, Joi } from 'celebrate';

import { emailRegexp } from '../constants/index.js';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
  })
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
  })
};
