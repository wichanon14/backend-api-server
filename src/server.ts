import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import loggerMiddleware from './middleware/logger.middleware';
import tokenValidationMiddleware from './middleware/token.middleware';
import authRouter from './modules/oidc/oidc.route';
import postRouter from './modules/posts/post.route';
import userRouter from './modules/users/user.route';
import swaggerRouter from './modules/swagger/swagger.route';
import { AppError } from './libs/error';
import { prisma } from './libs/prisma';
import { getPort } from './libs/port';
import cors from 'cors';
import { logger } from './libs/pino';
dotenv.config();

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

prisma.$connect().then(() => {
  logger.info('Database connected');
})

// Create a new express application instance
const app = express();
// The port the express app will listen on
const port = getPort();

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({ extended: true }));
// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors(corsOptions));

// Middleware
app.use(loggerMiddleware);

// Swagger
app.use(swaggerRouter);

// Health Check
app.get('/', (req:Request, res:Response) => {
  res.status(200).end();
});

// Auth Router
app.use(authRouter)
app.use(tokenValidationMiddleware)

// Routes
app.use(userRouter);
app.use(postRouter);

// Error Handler
app.use((err: AppError, req: Request, res: Response, next:NextFunction) => {
  logger.error(`Error handler ${JSON.stringify(err)}`);
  return next(res.status(err.status).json({
    status: 'error',
    msg: err.message
  }))
});


// Start the Express server
const server = app.listen(port,()=>{
    logger.info(`Server is running on port ${port}`);
})

export {
  server
}