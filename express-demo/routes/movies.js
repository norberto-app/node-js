const express = require("express");
const mongoose = require("mongoose");
const auth = require('../middleware/auth');
const { Movie, Genre, validate } = require("../models/movie");

const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await Movie.find().populate("genre", "name");
  console.log("movie is " + movie);
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  const movie = await Movie.findById(movieId);

  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send("The movie with the given Id does not exist.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const movie = new Movie({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      });

      res.send(await movie.save());
    } catch (error) {
      res.status(503).send(error);
    }
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const movieId = req.params.id;
      const result = await Movie.findByIdAndUpdate(
        movieId,
        {
          title: req.body.title,
          genre: req.body.genre,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
        {
          new: true,
        }
      );

      if (result) {
        res.send(result);
      } else {
        res.status(404).send("The movie with the given Id does not exist.");
      }
    } catch (error) {
      res.status(503).send(error);
    }
  }
});

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findByIdAndRemove(id);
  
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send("The movie with the given Id was not found");
    }
});

module.exports = router;
