import createHttpError from 'http-errors';

import Contact from '../db/models/Contact.js';

import { saveBufferToCloudinary } from '../services/cloudinary.js';

export const getContacts = async (req, res) => {
  const {_id: userId} = req.user;
  const {
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = 'asc',
    category,
    addAfter,
    search,
  } = req.query;
  const skip = (page - 1) * perPage;
  // Query builder
  const contactQuery = Contact.find({userId});

  // const filter = {};

  // if(category) {
  //   filter.category = category;
  // }

  // if(addAfter) {
  //   filter.createdAt = {}
  // }

  if (category) {
    contactQuery.where('category').equals(category);
  }

  if (addAfter) {
    contactQuery.where('createdAt').gte(addAfter);
  }

  if (search) {
    contactQuery.where({
      $or: [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          phone: {
            $regex: search,
            $options: 'i',
          },
        },
      ],
    });
  }

  const [contacts, totalItems] = await Promise.all([
    contactQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
    contactQuery.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.json({
    contacts,
    totalItems,
    page,
    perPage,
    totalPages,
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
    const {_id: userId} = req.user;
  const result = await Contact.findOne({_id: id, userId});
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  res.json(result);
};

export const addContact = async (req, res) => {
  let photo = null;
  if(req.file) {
    const {secure_url} = await saveBufferToCloudinary({buffer: req.file.buffer, folder: "photos"});
    photo = secure_url;
  }
  const {_id: userId} = req.user;
  const result = await Contact.create({...req.body, photo, userId});
  res.status(201).json(result);
};

export const updateContactById = async (req, res) => {
  const { id } = req.params;
  const {_id: userId} = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, userId }, req.body);
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  res.json(result);
};

export const deleteContactById = async (req, res) => {
  const { id } = req.params;
    const {_id: userId} = req.user;
  const result = await Contact.findOneAndDelete({ _id: id, userId });
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);

  res.json({
    message: 'Delete successfully',
  });
};
