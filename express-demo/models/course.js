const mongoose = require("mongoose");
const Joi = require("joi");

// Creaet Course schema
const courseShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
  },
  author: String,
  tags: {
    type: Array,
  },
  date: { type: Date, default: Date.now },
  isPuslished: Boolean,
  price: {
    type: Number,
  },
});

// Creaet course model
const Course = mongoose.model("Course", courseShema);

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    author: Joi.string().required(),
    tags: Joi.array().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    isPuslished: Joi.boolean(),
  });

  return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validateCourse;