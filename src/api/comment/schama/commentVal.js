const Joi = require("joi");

const addCommentVal = Joi.object({
    text: Joi.string().min(1).max(500).required(),
    postId: Joi.alternatives().try(
      Joi.string().min(1).max(20).required(),
      Joi.number().min(1).max(1000).required()
  )
});


const updateCommentVal =  Joi.object({
    id: Joi.alternatives().try(
      Joi.string().min(1).max(20).required(),
      Joi.number().min(1).max(1000).required()
  ),
  text: Joi.string().min(1).max(500).required(),

  });
  const deleteCommentVal =  Joi.object({
    id: Joi.alternatives().try(
      Joi.string().min(1).max(20).required(),
      Joi.number().min(1).max(1000).required()
  )
  });
module.exports = {
    addCommentVal,
    updateCommentVal,
    deleteCommentVal,
};
