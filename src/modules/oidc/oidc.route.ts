import { Router } from "express";
import { authCallbackHandler, authHandler, authLogoutHandler } from "./oidc.handler";
import { urlencoded } from "express";

const route = Router();

/**
 * @openapi
 * /auth:
 *   get:
 *     tags:
 *        - OIDC
 *     summary: OIDC Authentication
 *     description: OIDC Authentication
 *     responses:
 *       200:
 *         description: Returns a site for authentication.
 *       400:
 *         description: Bad Request
 */
route.get('/auth',authHandler)

// urlencoded({ extended: true }) is a middleware that parses incoming requests with urlencoded payloads
/**
 * @openapi
 * /callback:
 *   post:
 *     tags:
 *        - OIDC
 *     summary: OIDC Callback
 *     description: OIDC Callback
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *         content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: object
 *                  properties:
 *                    id_token:
 *                      type: string
 *                      default: id_token
 *                msg:
 *                  type: string
 *                  default: Login success
 *       400:
 *         description: Bad Request
 */
route.post('/callback', 
    // urlencoded({ extended: true }) is a middleware that parses incoming requests with urlencoded payloads
    urlencoded({ extended: true }),
    authCallbackHandler)

/**
 * @openapi
 * /logout:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - OIDC
 *     summary: OIDC Logout
 *     description: OIDC Logout
 *     headers:
 *       Authorization:
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Logout success
 *       400:
 *         description: Bad Request
 */

route.get('/logout',authLogoutHandler)

export default route;