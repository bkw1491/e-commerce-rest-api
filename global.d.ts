declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;

    //jwt env variables
    JWT_SECRET: string;
    JWT_ISSUER: string;
    JWT_EXPIRY: string;

    //database env variables
    DB_NAME: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_PORT: string;

    //stripe secret key
    STRIPE_SECRET: string
  }
}