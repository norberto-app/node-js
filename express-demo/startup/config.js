const morgan = require("morgan");
const config = require("config");
const winston = require("winston");

module.exports = function (app) {
  winston.info("Application name: " + config.get("name"));
  winston.info("Mail server: " + config.get("mail.host"));
  winston.info("Mail server password: " + config.get("mail.password"));

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    winston.info("Morgan enabled");
  }

  if (!config.get("jwtPrivateKey")) {
    winston.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }
};
