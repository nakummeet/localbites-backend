const apiResponse = require("../utils/apiResponse");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  return apiResponse.error(res, err.message || "Server Error", 500);
};

module.exports = errorMiddleware;
