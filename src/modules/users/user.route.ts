import { Router } from "express";
import {
    createUserHandler,
    getUserHandler,
    listUsersHandler,
    listUserPostsHandler,
    updateUserHandler,
    updateUserAddressHandler,
    updateUserAddressGeoHandler,
    updateUserCompanyHandler,
    patchUserAddressHandler,
    patchUserCompanyHandler,
    deleteUserHandler,
    patchUserHandler,
    getUserAddressHandler,
    getUserAddressGeoHandler,
    getUserCompanyHandler
} from "./users.handler";
import { requestValidatorMiddleware } from "../../middleware/request.validator.middleware";
import { createUserValidator, 
    deleteUserValidator, 
    getUserAddressGeoValidator, 
    getUserAddressValidator, 
    getUserCompanyValidator, 
    getUserValidator, 
    listUserPostsValidator, 
    listUsersValidator, 
    patchUserAddressValidator, 
    patchUserCompanyValidator, 
    patchUserValidator, 
    updateUserAddressGeoValidator, 
    updateUserAddressValidator, 
    updateUserCompanyValidator, 
    updateUserValidator 
} from "./user.validator";

const route = Router();

/**
 * @openapi
 * /users:
 *  get:
 *   security:
 *      - bearerAuth: []
 *   tags:
 *      - Users
 *   summary: API for listing all users
 *   description: API for listing all users
 *   headers:
 *      Authorization:
 *        schema:
 *          type: string
 *        description: Bearer token
 *   parameters:
 *      - in: query
 *        name: name
 *        type: string
 *        description: The name of the user
 *      - in: query
 *        name: username
 *        type: string
 *        description: The username of the user
 *      - in: query
 *        name: email
 *        type: string
 *        description: The email of the user
 *      - in: query
 *        name: phone
 *        type: string
 *        description: The phone of the user
 *      - in: query
 *        name: website
 *        type: string
 *        description: The website of the user
 *   responses:
 *     200:
 *       description: Returns a mysterious string.
 *       content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/Users'
 *     400:
 *       description: Bad Request
 *     500:
 *       description: Internal Server Error
 */
route.get(
    '/users',
    listUsersValidator,
    requestValidatorMiddleware,
    listUsersHandler
);

/**
 * @openapi
 * /users/{id}/address:
 *  get:
 *   security:
 *      - bearerAuth: []
 *   tags:
 *      - Users
 *   summary: API for getting an address of a user
 *   description: API for getting an address of a user
 *   headers:
 *      Authorization:
 *        schema:
 *          type: string
 *        description: Bearer token
 *   parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        required: true
 *        description: The id of the user
 *   responses:
 *     200:
 *       description: Returns an address of a user.
 *       content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/Address'
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 *     500:
 *       description: Internal Server Error
 *
 */
route.get(
    '/users/:id/address',
    getUserAddressValidator,
    requestValidatorMiddleware,
    getUserAddressHandler
);

/**
 * @openapi
 * /users/{id}/address/{addressId}/geo:
 *  get:
 *   security:
 *      - bearerAuth: []
 *   tags:
 *      - Users
 *   summary: API for listing geo of an address of a user
 *   description: API for listing geo of an address of a user
 *   headers:
 *      Authorization:
 *        schema:
 *          type: string
 *        description: Bearer token
 *   parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        required: true
 *        description: The id of the user
 *      - in: path
 *        name: addressId
 *        type: number
 *        required: true
 *        description: The id of the address
 *   responses:
 *     200:
 *       description: Returns an address of a user.
 *       content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/Geo'
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 *     500:
 *       description: Internal Server Error
 */
route.get(
    '/users/:id/address/:addressId/geo',
    getUserAddressGeoValidator,
    requestValidatorMiddleware,
    getUserAddressGeoHandler
);

/**
 * @openapi
 * /users/{id}/company:
 *  get:
 *   security:
 *      - bearerAuth: []
 *   tags:
 *      - Users
 *   summary: API for getting a company of a user
 *   description: API for getting a company of a user
 *   headers:
 *      Authorization:
 *        schema:
 *          type: string
 *        description: Bearer token
 *   parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        required: true
 *        description: The id of the user
 *   responses:
 *     200:
 *       description: Returns a company of a user.
 *       content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/Company'
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 *     500:
 *       description: Internal Server Error
 */
route.get(
    '/users/:id/company',
    getUserCompanyValidator,
    requestValidatorMiddleware,
    getUserCompanyHandler
);

/**
 * @openapi
 * /users/{id}/posts:
 *  get:
 *   security:
 *      - bearerAuth: []
 *   tags:
 *      - Users
 *   summary: API for getting posts of a user
 *   description: API for getting posts of a user
 *   headers:
 *      Authorization:
 *        schema:
 *          type: string
 *        description: Bearer token
 *   parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        required: true
 *        description: The id of the user
 *      - in: query
 *        name: title
 *        type: string
 *        description: The title of the post
 *      - in: query
 *        name: body
 *        type: string
 *        description: The body of the post
 *   responses:
 *     200:
 *       description: Returns a posts of a user.
 *       content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/Posts'
 *     400:
 *       description: Bad Request
 *     500:
 *       description: Internal Server Error
 */
route.get(
    '/users/:id/posts',
    listUserPostsValidator,
    requestValidatorMiddleware,
    listUserPostsHandler
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for getting a user
 *     description: API for getting a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     responses:
 *       200:
 *         description: Returns a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/FullUser'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.get(
    '/users/:id',
    getUserValidator,
    requestValidatorMiddleware,
    getUserHandler
);

/**
 * @openapi
 * /users:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for creating a user
 *     description: API for creating a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Returns a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
route.post(
    '/users',
    createUserValidator,
    requestValidatorMiddleware,
    createUserHandler
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for updating a user
 *     description: API for updating a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Returns a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.put(
    '/users/:id',
    updateUserValidator,
    requestValidatorMiddleware,
    updateUserHandler
);

/**
 * @openapi
 * /users/{id}/address:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for updating an address of a user
 *     description: API for updating an address of a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserAddress'
 *     responses:
 *       200:
 *         description: Returns an address of a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.put(
    '/users/:id/address',
    updateUserAddressValidator,
    requestValidatorMiddleware,
    updateUserAddressHandler
);

/**
 * @openapi
 * /users/{id}/address/{addressId}/geo:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for updating geo of an address of a user
 *     description: API for updating geo of an address of a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *        - in: path
 *          name: addressId
 *          type: number
 *          required: true
 *          description: The id of the address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserAddressGeo'
 *     responses:
 *       200:
 *         description: Returns an address of a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Geo'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.put(
    '/users/:id/address/:addressId/geo/',
    updateUserAddressGeoValidator,
    requestValidatorMiddleware,
    updateUserAddressGeoHandler
);
/**
 * @openapi
 * /users/{id}/company:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for updating a company of a user
 *     description: API for updating a company of a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserCompany'
 *     responses:
 *       200:
 *         description: Returns a company of a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.put(
    '/users/:id/company',
    updateUserCompanyValidator,
    requestValidatorMiddleware,
    updateUserCompanyHandler
);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for patching a user
 *     description: API for patching a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchUser'
 *     responses:
 *       200:
 *         description: Returns a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.patch(
    '/users/:id',
    patchUserValidator,
    requestValidatorMiddleware,
    patchUserHandler
);

/**
 * @openapi
 * /users/{id}/address:
 *   patch:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for patching an address of a user
 *     description: API for patching an address of a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchUserAddress'
 *     responses:
 *       200:
 *         description: Returns an address of a user.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.patch(
    '/users/:id/address',
    patchUserAddressValidator,
    requestValidatorMiddleware,
    patchUserAddressHandler
);

/**
 * @openapi
 * /users/{id}/company:
 *   patch:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for patching a company of a user
 *     description: API for patching a company of a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchUserCompany'
 *     responses:
 *       200:
 *         description: Returns a company of a user.
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.patch(
    '/users/:id/company',
    patchUserCompanyValidator,
    requestValidatorMiddleware,
    patchUserCompanyHandler
);


/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     summary: API for deleting a user
 *     description: API for deleting a user
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          required: true
 *          description: The id of the user
 *     responses:
 *       200:
 *         description: Returns a user.
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 default: User deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.delete(
    '/users/:id',
    deleteUserValidator,
    requestValidatorMiddleware,
    deleteUserHandler
);


export default route;