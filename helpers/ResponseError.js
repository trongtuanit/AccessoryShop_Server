module.exports = class ResponseError {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
};
