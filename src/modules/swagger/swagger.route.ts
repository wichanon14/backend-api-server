import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Post management API',
      version: '1.0.0',
    },
    components:{
        securitySchemes: {
            bearerAuth: {
                type:'http',
                scheme:'bearer',
                bearerFormat:'JWT'
                }

            },
        }
    },
    security:[{
        bearerAuth:[]
    }],
    apis: [
        `${__dirname}/../**/*.route.ts`,
        `${__dirname}/../**/*.type.ts`,
        `${__dirname}/../**/*.validator.ts`],
};

export const openapiSpecification = swaggerJsdoc(options);

const route = Router();

route.use('/docs', swaggerUi.serve);
route.get('/docs', swaggerUi.setup(openapiSpecification));

export default route;