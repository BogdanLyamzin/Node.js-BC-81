import { Schema, model } from 'mongoose';

import {
  contactCategoryList,
  contactDefaultCategory,
} from '../../constants/contact.constants.js';
import { emailRegexp } from '../../constants/index.js';

import { setUpdateSettings } from '../mongoose.hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: contactCategoryList,
      default: contactDefaultCategory,
    },
  },
  { versionKey: false, timestamps: true },
);
contactSchema.index({category: 1})

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

export const contactSortFields = [
  "_id",
  "email",
  "phone",
  "category",
  "createdAt",
  "updatedAt"
]

const Contact = model('Contact', contactSchema);

export default Contact;
