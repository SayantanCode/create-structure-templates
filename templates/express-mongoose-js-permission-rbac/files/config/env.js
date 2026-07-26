import 'dotenv/config';
import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),
  // Not .required(): tests connect directly to an in-memory MongoDB instance
  // (see test/setup.js) and never read this value, so it only needs to be a
  // real URI in dev/production, where a real .env is expected to supply one.
  MONGO_URI: Joi.string().default('mongodb://127.0.0.1:27017/app').description('MongoDB connection URI'),
  JWT_ACCESS_SECRET: Joi.string().required().description('Secret used to sign access tokens'),
  JWT_REFRESH_SECRET: Joi.string().required().description('Secret used to sign refresh tokens'),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
}).unknown().required();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  MONGO_URI: envVars.MONGO_URI,
  JWT_ACCESS_SECRET: envVars.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: envVars.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: envVars.JWT_REFRESH_EXPIRES_IN,
};
