import { HttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

const errorMiddleware = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const { status = 500 } = error;
    return res.status(status).json({
      message: error.message,
    });
  }

  const isMongooseError =
    error instanceof MongooseError.ValidationError ||
    error instanceof MongooseError.CastError;

  if (isMongooseError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  // if(error instanceof MongooseError.MongoServerError) {
  //    return res.status(409).json({
  //     message: error.message,
  //   });
  // }

  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Some error' : error.message;
  res.status(500).json({
    message,
  });
};

export default errorMiddleware;
