// const { ResponseEntity, HttpStatus } = require("../dto/dataResponse");
const ResponseError = require("../helpers/ResponseError");

const permission = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.role)) {
      throw new ResponseError(403, "Forbidden");
    }
    next();
  };
};

module.exports = permission;
