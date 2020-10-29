const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).send("Invalid email or password.");
      }

      const validCredentials = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (validCredentials) {
        res.send(user.generateAuthToken());
      } else {
        res.status(400).send("Invalid email or password.");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
}

module.exports = router;
