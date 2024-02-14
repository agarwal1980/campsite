const joi = require('joi');

module.exports = reviewSchema = joi.object({
    rating: joi.object({
      desc : joi.string().required(),
      range:joi.number().required()
    }).required()
});