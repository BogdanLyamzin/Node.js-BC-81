import {HttpError} from "http-errors";

const errorMiddleware = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const { status = 500 } = error;
    return res.status(status).json({
      message: error.message,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Some error' : error.message;
  res.status(500).json({
    message,
  });
};

export default errorMiddleware;
