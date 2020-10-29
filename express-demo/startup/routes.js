const express = require("express");
const errorLogger = require("../middleware/errors");

const courses = require("../routes/courses");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");

module.exports = function (app) {
  
  // express middleware
  app.use(express.json());
  app.use(express.raw());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(errorLogger);

  // templating engines
  app.set("view engine", "pug");
  app.set("views", "./views"); // default

  // Routes
  app.use("/", home);
  app.use("/api/courses", courses);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
};
