const Joi = require("joi");

const createpostVal = Joi.object({
  text: Joi.string().min(3).max(500),
});
const findOnePostVal = Joi.object({
  id: Joi.alternatives().try(
    Joi.string().min(1).max(20).required(),
    Joi.number().min(1).max(10000000000).required()
  ),
});
const updatePostVal = Joi.object({
    id: Joi.alternatives().try(
      Joi.string().min(1).max(20).required(),
      Joi.number().min(1).max(100).required()
    ),
    text: Joi.string().min(3).max(500),
  });
const deletePostVal = Joi.object({
    id: Joi.alternatives().try(
      Joi.string().min(1).max(20),
      Joi.number().min(1).max(100)
    ).required(),
  });
module.exports = {
    createpostVal,
    findOnePostVal,
    updatePostVal,
    deletePostVal,
};
