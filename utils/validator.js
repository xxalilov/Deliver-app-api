const Joi = require("joi");

exports.restaurantSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(5).required(),
  deliverPrice: Joi.number().required(),
  type: Joi.string().required(),
  address: Joi.string().required(),
  active: Joi.string().required(),
  image: Joi.string(),
});

exports.mealSchema = Joi.object({
  title: Joi.string().min(3).required(),
  price: Joi.number().required(),
  description: Joi.string().min(5).required(),
  type: Joi.string().required(),
  image: Joi.string(),
});

exports.typeSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.string(),
});
