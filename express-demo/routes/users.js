const express = require("express");
const mongoose = require("mongoose");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth")
const { User, validate } = require("../models/user");

const router = express.Router();

router.get("/me", auth, async (req, res) => {

  try {
    res.send(await User.findById(req.user._id).select("-password"));
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    const msg = {
      message: error.details[0].message,
    };
    res.status(400).send(msg);
  } else {
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
          return res.status(400).send('User already registered');
      }

      const salt = await bcrypt.genSalt(10);

      user = new User(lodash.pick(req.body, ['name', 'email', 'password']));
      user._id = new mongoose.Types.ObjectId();
      user.password = await bcrypt.hash(user.password, salt);
      user = await user.save();

      const authToken = user.generateAuthToken();

      res.header('x-auth-token', authToken).send(lodash.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

router.put("/:id", async (req, res) => {
  // validate. If invalid, return 400
  const { error } = validate(req.body);

  if (error) {
    const msg = {
      message: error.details[0].message,
    };
    res.status(400).send(msg);
  } else {
    try {
      // Find the existing user object.
      const id = req.params.id;
      const user = await User.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
        {
          new: true,
        }
      );

      if (user) {
        res.send(user);
      } else {
        res.status(404).send("The user with the given Id does not exist.");
      }
    } catch (ex) {
      const errors = [];

      for (err in ex.errors) {
        const msg = {
          message: err.details[0].message,
        };

        errors.push(msg);
      }

      if (errors.length === 0) {
        res.status(404).send("The user with the given Id does not exist.");
      } else {
        res.status(404).send(errors);
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndRemove(id);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send("The user with the given Id was not found");
  }
});

module.exports = router;
