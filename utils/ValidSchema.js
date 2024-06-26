const joi = require('joi');

const campgroundSchema = joi.object({
    campground : joi.object({
      title:joi.string().required(),
      location:joi.string().required(),
      price:joi.number().required().min(0),
      description:joi.string().required()
    }).required(),
    deleteImages : joi.array()
  })

module.exports = campgroundSchema;  