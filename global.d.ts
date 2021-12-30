declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;

    //jwt env variables
    JWT_SECRET: string;
    JWT_ISSUER: string;
    JWT_EXPIRY: string;

    //database env variables
    DATABASE_NAME: string;
    DATABASE_URL: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: string;

    //stripe secret key
    STRIPE_SECRET: string
  }
}