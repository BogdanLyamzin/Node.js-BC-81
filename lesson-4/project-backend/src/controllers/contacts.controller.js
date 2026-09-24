import createHttpError from 'http-errors';

import Contact from '../db/models/Contact.js';

export const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  // const result = await Contact.findOne({_id: id});
  const result = await Contact.findById(id);
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  res.json(result);
};

export const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOneAndUpdate({ _id: id }, req.body, {
    returnDocument: 'after',
  });
  //  const result = await Contact.findByIdAndUpdate(id, req.body, {
  //   returnDocument: 'after',
  // });
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  res.json(result);
};

export const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({ _id: id });
  // const result = await Contact.findByIdAndDelete(id);
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  // res.status(204).send();
  res.json({
    message: 'Delete successfully',
  });
};
