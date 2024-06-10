import { Issuer } from "openid-client"
import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import { logger } from "./pino";

export const validateToken = async (token:string)=>{
    // discover the oidc issuer and get data from the json
    const oidcIssue = await Issuer.discover(process.env.OIDC_ISSUER as string);
    // get keys from the jwks_uri
    const client = jwksClient({
        jwksUri: oidcIssue.metadata.jwks_uri as string
    });
    // decode token_id to get the kid
    try{
        const decoded = jwt.decode(token, {complete: true});
        
        if( !decoded ){
            return false;
        }
        
        // get the key from the kid
        const key = await (await client.getSigningKey(decoded.header.kid as string)).getPublicKey()

        if( !key ){
            return false;
        }

        jwt.verify(token, key as jwt.Secret, { // Cast key as jwt.Secret
            algorithms: ['RS256'],
            audience: process.env.OIDC_CLIENT_ID as string,
            issuer: oidcIssue.metadata.issuer as string
        })
        return true
    }catch(err){
        logger.error('validateToken error', err)
        return false;
    }

}