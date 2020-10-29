const winston = require("winston");

function logError(err, req, res, next) {
  winston.error(err.message, err);

  // Log levels
  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed");
}

module.exports = logError;
