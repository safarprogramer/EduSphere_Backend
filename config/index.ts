import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  social_default_pass: process.env.SOCIAL_DEFAULT_PASS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  cookie: {
    access_expire: process.env.COOKIE_EXPIRESIN,
    refresh_expire: process.env.COOKIE_REFRESH_EXPIRESIN,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  },
  redis: process.env.REDIS_URL,
  activaton: process.env.ACTIVATION_SECRET,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    mail: process.env.SMTP_MAIL,
    password: process.env.SMTP_PASSWORD,
  },
  cipher: process.env.VDO_CIPHER_API_SECRET,
  stripe_publish: process.env.STRIPE_PUBLISH_KEY,
  stripe_secret: process.env.STRIPE_SECRET_KEY,
};
