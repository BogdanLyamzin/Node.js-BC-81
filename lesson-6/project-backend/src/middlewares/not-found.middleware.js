const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`,
  });
};

export default notFoundMiddleware;
