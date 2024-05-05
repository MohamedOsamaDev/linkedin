const Joi = require("joi");


const requestForConnectionVal = Joi.object({
    to: Joi.alternatives().try(
    Joi.string().min(1).max(2000).required(),
    Joi.number().min(1).max(10000).required()
  ),
});
const acceptConnectionVal = Joi.object({
    id: Joi.alternatives().try(
    Joi.string().min(3).max(2000).required(),
    Joi.number().min(10).max(10000).required()
  ),
});
const deleteConnectionRequsetVal = Joi.object({
    id: Joi.alternatives().try(
    Joi.string().min(3).max(2000).required(),
    Joi.number().min(10).max(10000).required()
  ),
});
module.exports = {
    requestForConnectionVal,
    acceptConnectionVal,
    deleteConnectionRequsetVal
};
