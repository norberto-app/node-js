const winston = require("winston");

require("winston-mongodb");
require("express-async-errors");

// Throw an error to simulate an unhandled promise rejection.
//const p = Promise.reject(new Error('Something failed during startup.'));
//p.then(() => console.log('Done!'));

// configure winstone for uncaught exceptions
module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.exceptions.handle(
    winston.add(
      new winston.transports.File({ filename: "uncaughtExceptions.log" })
    )
  );

  // Configure winston logger
  winston.add(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
    })
  );
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db:
        "mongodb+srv://norberto:norberto@cluster0.5jjd3.mongodb.net/playground",
      level: "error",
      options: {
        useUnifiedTopology: true,
      },
    })
  );
};
