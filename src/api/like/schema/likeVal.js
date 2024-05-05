const Joi = require("joi");


const addLikeVal = Joi.object({
    id: Joi.alternatives().try(
    Joi.string().min(1).max(20).required(),
    Joi.number().min(1).max(100).required()
  ),
});
const deleteLikeVal = Joi.object({
    id: Joi.alternatives().try(
    Joi.string().min(1).max(20).required(),
    Joi.number().min(1).max(100).required()
  ),
});
const getlikesVal = Joi.object({
    id: Joi.alternatives().try(
    Joi.string().min(1).max(20).required(),
    Joi.number().min(1).max(100).required()
  ),
});
module.exports = {
    addLikeVal,
    deleteLikeVal,
    getlikesVal
};
