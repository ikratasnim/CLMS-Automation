import dotenv from 'dotenv';
dotenv.config();

export const getEnv = () => {
  const env = process.env.ENVIRONMENT || 'staging';
  const url = env === 'production' ? process.env.PROD_URL : process.env.STAGING_URL;
  const username = env === 'production' ? process.env.PROD_USERNAME : process.env.STAGING_USERNAME;
  const password = env === 'production' ? process.env.PROD_PASSWORD : process.env.STAGING_PASSWORD;

  return { env, url, username, password };
};
