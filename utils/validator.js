const Joi = require("joi");
const joiPassword = require("joi-password");
const password = joiPassword.joiPassword;

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

exports.subadminSchema = Joi.object({
  name: Joi.string().required(),
  login: Joi.string().trim().required(),
  password: password
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required(),
});

exports.adminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().trim().email().required(),
  password: password
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required(),
});

exports.userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  surname: Joi.string(),
  phoneNumber: Joi.string().required(),
  cardNumber: Joi.string(),
  gender: Joi.string().required(),
  birthday: Joi.string(),
  address: Joi.string(),
});

exports.passwordSchema = Joi.object({
  password: password
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required(),
});
