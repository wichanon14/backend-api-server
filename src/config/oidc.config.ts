import dotenv from 'dotenv';
import { Issuer } from "openid-client";

dotenv.config();

export const getClientConfig = async () => {
    const issuer = await Issuer.discover(process.env.OIDC_ISSUER as string);

    const client = new issuer.Client({
        client_id: process.env.OIDC_CLIENT_ID as string,
        redirect_uris: [process.env.OIDC_REDIRECT_URI as string],
        response_types: ['id_token']
    });

    return client;
}