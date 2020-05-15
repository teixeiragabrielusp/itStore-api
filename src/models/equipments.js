const Joi = require('@hapi/joi');

let Equipment = Joi.object({
    model: Joi.string().required(),
    category: Joi.string().valid('cartridge', 'toner').required(),
    ppm: Joi.number().integer().min(0).max(999999),
    wifi: Joi.boolean(),
    consumption: Joi.number().min(0).max(999999)
});

module.exports = Equipment;