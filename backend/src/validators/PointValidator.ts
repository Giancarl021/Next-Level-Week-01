import { celebrate, Joi, Segments } from 'celebrate';

class PointValidator {
    show() {
        return celebrate({
            [Segments.PARAMS]: Joi.object().keys({
                id: Joi.number().required()
            })
        });
    }

    index() {
        return celebrate({
            [Segments.QUERY]: Joi.object().keys({
                city: Joi.string().required(),
                uf: Joi.string().required(),
                items: Joi.string().required()
            })
        });
    }

    create() {
        return celebrate({
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().pattern(/\S+@\S+\.\S+/).required(),
                whatsapp: Joi.string().pattern(/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/).required(),
                latitude: Joi.number().required(),
                longitude: Joi.number().required(),
                city: Joi.string().required(),
                uf: Joi.string().length(2).required(),
                items: Joi.array().required(),
                // image: Joi.binary().required()
            })
        });
    }
}

export default PointValidator;