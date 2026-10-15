import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  if (!file.mimetype) {
    return callback(createHttpError(400, 'File corrupted'));
  }
  if (!file.mimetype.startsWith('image/')) {
    return callback(createHttpError(400, 'Only images allow'));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
