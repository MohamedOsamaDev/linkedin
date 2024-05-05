const Joi = require("joi");
//  fullName, title, email, username 
const updateMeval = Joi.object({
    fullName: Joi.string().min(3).max(500),
    title: Joi.string().min(3).max(500),
    email: Joi.string().email(),
    username: Joi.string().min(3).max(500),
});

module.exports = {
    updateMeval
};
