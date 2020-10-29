const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const {Course, validate} = require('../models/course');

const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await Course.find().sort("name"));
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  
  if (error) {
    const msg = {
      message: error.details[0].message,
    };
    res.status(400).send(msg);
  } else {
    try {
      const course = new Course({
        name: req.body.name,
        author: req.body.author,
        category: req.body.category,
        tags: req.body.tags,
        isPuslished: req.body.isPuslished,
        price: req.body.price,
      });

      res.send(await course.save());
    } catch (error) {
        res.status(503).send(error);
    }
  }
});

router.put("/:id", auth, async (req, res) => {

    // validate. If invalid, return 400
    const { error } = validate(req.body);

    if (error) {
        const msg = {
          message: error.details[0].message,
        };
        res.status(400).send(msg);
    } else {

        try {
            // Find the existing course object.
            const id = req.params.id;
            const course = await Course.findByIdAndUpdate(id, {
                name: req.body.name,
                author: req.body.author,
                tags: req.body.tags,
                isPuslished: req.body.isPuslished,
                price: req.body.price
            }, {
                new: true
            });

            if (course) {
                res.send(course);
            } else {
                res.status(404).send('The course with the given Id does not exist.');
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
                res.status(404).send('The course with the given Id does not exist.');
            } else {
                res.status(404).send(errors);
            }
        }
    }
});

router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const course = await Course.findById(id);

    if (course) {
      res.send(course);
    } else {
      res.status(404).send("The course with the given Id was not found");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const course = await Course.findByIdAndRemove(id);

  if (course) {
    res.send(course);
  } else {
    res.status(404).send("The course with the given Id was not found");
  }
});

module.exports = router;
