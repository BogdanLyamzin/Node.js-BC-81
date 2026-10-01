import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contacts.controller.js';

import {
  getContactsSchema,
  getContactByIdSchema,
  createContactSchema,
  updateContactSchema,
  deleteContactSchema,
} from '../validation/contacts.validation.js';

const contactsRouter = Router();

contactsRouter.get(
  '/',
  celebrate(getContactsSchema, { abortEarly: false }),
  getContacts,
);

contactsRouter.get(
  '/:id',
  celebrate(getContactByIdSchema, { abortEarly: false }),
  getContactById,
);

contactsRouter.post(
  '/',
  celebrate(createContactSchema, { abortEarly: false }),
  addContact,
);

contactsRouter.patch(
  '/:id',
  celebrate(updateContactSchema, { abortEarly: false }),
  updateContactById,
);

contactsRouter.delete(
  '/:id',
  celebrate(deleteContactSchema, { abortEarly: false }),
  deleteContactById,
);

export default contactsRouter;
