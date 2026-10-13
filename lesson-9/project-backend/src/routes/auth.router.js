import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/auth.validation.js';

import { registerUser, verifyUser, loginUser, refreshUserSession, logoutUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post(
  '/register',
  celebrate(registerUserSchema, { abortEarly: false }),
  registerUser,
);

authRouter.get("/verify", verifyUser);

authRouter.post(
  '/login',
  celebrate(loginUserSchema, { abortEarly: false }),
  loginUser,
);

authRouter.post("/refresh", refreshUserSession);

authRouter.post("/logout", logoutUser)

export default authRouter;
