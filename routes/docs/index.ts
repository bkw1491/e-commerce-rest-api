import express from 'express';
import swaggerUi from 'swagger-ui-express';
import spec from '@docs/swagger.json';


export const docsRouter = express.Router();


docsRouter.use(
  "/",
  swaggerUi.serve, 
  swaggerUi.setup(spec)
  );