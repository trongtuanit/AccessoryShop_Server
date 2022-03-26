const { ResponseEntity } = require("../dto/dataResponse");

module.exports = (err, req, res, next) => {
  let error = { ...err };

  if (err.name === "CastError") {
    error.statusCode = 404;
    error.message = `Resource not found`;
  }

  if (err.statusCode === 404) {
    error.statusCode = 404;
    error.message = err.message;
  }

  if (err.statusCode === 401) {
    error.statusCode = 401;
    error.message = err.message;
  }

  if (err.statusCode === 403) {
    error.statusCode = 403;
    error.message = err.message;
  }

  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = "Duplicate resource";
  }

  const statusCode = error.statusCode || 500;
  const message = "Server error handler return with message: " + (error.message || "Internal Server Error");

  res.status(statusCode).json(new ResponseEntity(statusCode, message));
};
