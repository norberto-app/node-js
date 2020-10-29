const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const auth = require("../middleware/auth");
const validator = require("../middleware/validator");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", [auth, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) {
    return res.status(404).send("Requested rental does not exist.");
  }

  if (rental.dateReturned) {
    return res.status(400).send("This rental was already processed");
  }

  rental.return();

  await rental.save();
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  res.send(rental);
});

function validateReturn(data) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(data);
}

module.exports = router;
