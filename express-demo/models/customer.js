const mongoose = require("mongoose");
const Joi = require('joi');

// Define customer schema and model.
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean().required(),
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;