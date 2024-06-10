import { NextFunction, Request, Response } from 'express';
import { getClientConfig } from '../../config/oidc.config';
import { generators } from 'openid-client';
import jsonwebtoken, { Jwt, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from '../../libs/pino';
import { AppError, HttpStatus} from '../../libs/error';
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyingData : any = {};

const CALLBACK_URL = process.env.OIDC_REDIRECT_URI as string;

export const authHandler = async (_: Request, res: Response) => {

    // get client config
    const client = await getClientConfig();

    // generate code_verifier, code_challenge and nonce
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    // nonce is a random value that should be unique for each request to prevent replay attacks
    const nonce = generators.nonce();

    // store nonce value in app temporary storage
    verifyingData[nonce as string] = nonce;

    const authorizationUrl = client.authorizationUrl({
        scope: 'openid profile email',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        response_type: 'id_token',
        response_mode: 'form_post',
        nonce
    })

    res.redirect(authorizationUrl);

}

export const authCallbackHandler = async (req: Request, res: Response, next:NextFunction) => {
    // get client config
    const client = await getClientConfig();
    // get callback params
    const params = client.callbackParams(req);

    try{
        // decode the id_token to get the nonce value
        const isValidIdToken = jsonwebtoken.decode(params.id_token as string) as Jwt;
        if( !isValidIdToken ){
            return next(new AppError('Invalid id_token',HttpStatus.BAD_REQUEST));
        }
        const decodeData = isValidIdToken.payload as JwtPayload;
        if( decodeData && !decodeData.nonce ){
            return next(new AppError('Invalid id_token',HttpStatus.BAD_REQUEST));
        }
        const { nonce } = decodeData as { nonce: string };

        // verify nonce value and nounce value is the value that was stored in app temporary storage use for comparison to prevent replay attacks
        const token = await client.callback(CALLBACK_URL, params,
            {
                nonce: verifyingData[nonce]
            }
        );

        if(!token){
            throw new AppError('client callback unreachable',HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // clear nonce value in app temporary storage
        delete verifyingData[nonce];

        res.send({
            token,
            msg: 'Login success'
        }).end();
    }catch(err){
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }

}

export const authLogoutHandler = async (req: Request, res: Response) => {
    const client = await getClientConfig();

    const logoutURL = client.issuer.metadata.end_session_endpoint || 'http://localhost:3000';
    res.redirect(logoutURL);
}