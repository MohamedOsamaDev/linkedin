const Joi = require("joi");

const addBlockVal = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().min(3).max(20).required(),
    Joi.number().min(10).max(100).required()
)
});

const removeBlockVal =  Joi.object({
    id: Joi.alternatives().try(
      Joi.string().min(3).max(20).required(),
      Joi.number().min(10).max(100).required()
  )
  });

module.exports = {
  addBlockVal,
  removeBlockVal,
};
