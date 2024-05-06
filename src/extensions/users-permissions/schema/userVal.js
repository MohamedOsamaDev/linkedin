const Joi = require("joi");
//  fullName, title, email, username 
const updateMeval = Joi.object({
    fullName: Joi.string().min(3).max(50),
    title: Joi.string().min(1).max(50),
    email: Joi.string().email(),
    username: Joi.string().min(1).max(50),
});

module.exports = {
    updateMeval
};
