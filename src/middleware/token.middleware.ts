import { Request, Response, NextFunction,Router } from 'express';
import { validateToken } from '../libs/validateToken';
import { HttpStatus,AppError } from '../libs/error';
import { logger } from '../libs/pino';


const route = Router();

export const tokenValidationMiddleware = async (req: Request, res:Response, next: NextFunction ) => {
    const headerToken : string = req.headers.authorization || '';

    // check if token is present
    if (!headerToken) {
        return next(new AppError('Token is required',HttpStatus.UNAUTHORIZED));
    // check if token is in the right format of Bearer token
    }

    const token = headerToken.split(' '); // [Bearer, XXXXXXXXXX]
    if (token[0] !== 'Bearer') {
        return next(new AppError('Invalid authorization type',HttpStatus.UNAUTHORIZED))
    }
    try{
        // verify the token
        const result = await validateToken(token[1]);
        if( result ){
            next();
        } else {
            throw new AppError('Invalid token',HttpStatus.UNAUTHORIZED)
        }
    }catch(err){
        return next(new AppError('Invalid token',HttpStatus.UNAUTHORIZED))
    }

}

route.use(tokenValidationMiddleware);

export default route;