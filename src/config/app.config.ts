// import { registerAs } from '@nestjs/config';
// import Joi from 'joi';

// export default registerAs('appConfig', () => ({
//   port: parseInt(process.env.PORT || '3000', 10),
//   database: {
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT || '5432', 10),
//     name: process.env.DB_NAME || 'application_setup_db',
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || 'postgres',
//   },
// }));

// export const appConfigValidationSchema = {
//   NODE_ENV: Joi.string()
//     .valid('development', 'production', 'test')
//     .default('development'),
//   PORT: Joi.number().default(3000),
//   DB_HOST: Joi.string().required(),
//   DB_PORT: Joi.number().default(5432),
//   DB_NAME: Joi.string().required(),
//   DB_USER: Joi.string().required(),
//   DB_PASSWORD: Joi.string().required(),
// };
