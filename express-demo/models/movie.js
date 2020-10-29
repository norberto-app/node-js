const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
});

// Define movie schema and model.

const movieSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genre",
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Genre = mongoose.model("genre", genreSchema);
const Movie = mongoose.model("movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.validate = validateMovie;
