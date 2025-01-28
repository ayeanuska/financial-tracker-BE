export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "internal server failure";

  // message.includes

  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
