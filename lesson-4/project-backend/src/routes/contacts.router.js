import { Router } from 'express';

import {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contacts.controller.js';

const contactsRouter = Router();

contactsRouter.get('/', getContacts);

contactsRouter.get('/:id', getContactById);

contactsRouter.post("/", addContact);

contactsRouter.patch("/:id", updateContactById);

contactsRouter.delete("/:id", deleteContactById);

export default contactsRouter;
