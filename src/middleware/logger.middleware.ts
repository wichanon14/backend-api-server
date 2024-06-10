import { Router } from "express";
import { logger } from "../libs/pino";

const route = Router();

route.use((req, res, next) => {
    logger.info(`${req.method} Request made to ${req.url} at ${new Date()}, Headers: ${JSON.stringify(req.headers)}`);
    next();
});

export default route;