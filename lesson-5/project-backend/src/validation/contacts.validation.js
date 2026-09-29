import { Segments, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';

import {
  contactCategoryList,
  contactDefaultCategory,
} from '../constants/contact.constants.js';
import {emailRegexp} from "../constants/index.js";

const objectIdValidator = (value, helpers)=> {
  return isValidObjectId(value) ? value : helpers.message("Invalid id format")
}

export const createContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required(),
    // email: Joi.string().email().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    phone: Joi.string().required().messages({
      "any.required": "phone must be exist"
    }),
    category: Joi.string()
      .valid(...contactCategoryList)
      .default(contactDefaultCategory),
  }),
};

export const updateContactSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().pattern(emailRegexp),
    phone: Joi.string(),
    category: Joi.string()
      .valid(...contactCategoryList),
  }).min(1),
};

export const getContactByIdSchema = {
   [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
}

export const deleteContactSchema = {
   [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
}
