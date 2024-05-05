const Joi = require("joi");

const GetConnectionsForSomeOneVal = Joi.object({
  username: Joi.string().min(3).max(20),
  fullName: Joi.string().min(3).max(20),
}).xor("fullName", "lastName").required();

const DeleteConnectionVal = Joi.object({
  id: Joi.alternatives().try(
    Joi.string().min(3).max(20).required(),
    Joi.number().min(10).max(100).required()
  ),
});

module.exports = {
  GetConnectionsForSomeOneVal,
  DeleteConnectionVal,
};
