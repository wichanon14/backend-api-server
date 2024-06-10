import { Router } from "express";
import { createPostValidator, deletePostValidator, getPostValidator, listPostsValidator, patchPostValidator, updatePostValidator } from "./post.validator";
import { requestValidatorMiddleware } from "../../middleware/request.validator.middleware";
import {
    listPostsHandler,
    getPostHandler,
    createPostHandler,
    updatePostHandler,
    patchPostHandler,
    deletePostHandler
} from "./post.handler";
const route = Router();

/**
 * @openapi
 * /posts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - Posts
 *     summary: API for listing all posts
 *     description: API for listing all posts
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: query
 *          name: title
 *          type: string
 *          default: title
 *          description: The title of the post
 *        - in: query
 *          name: body
 *          type: string
 *          default: body of post
 *          description: The body of the post
 *        - in: query
 *          name: userId
 *          type: number
 *          default: 1
 *          description: The user id of the post
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Bad Request
 */
route.get(
    '/posts',
    listPostsValidator,
    requestValidatorMiddleware,
    listPostsHandler
);

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Posts
 *     summary: API for listing all posts
 *     description: API for listing all posts
 *     headers:
 *        Authorization:
 *         schema:
 *           type: string
 *         description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          default: 1
 *          required: true
 *          description: The id of the post
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.get(
    '/posts/:id',
    getPostValidator,
    requestValidatorMiddleware,
    getPostHandler
);

/**
 * @openapi
 * /posts:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *       - Posts
 *     summary: API for creating a post
 *     description: API for creating a post
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: Returns a mysterious string.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
route.post(
    '/posts',
    createPostValidator,
    requestValidatorMiddleware,
    createPostHandler
);

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *       - Posts
 *     summary: API for updating a post
 *     description: API for updating a post
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          default: 1
 *          required: true
 *          description: The id of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Returns updated post.
 *         content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *       400:
 *          description: Bad Request
 *       404:
 *          description: Not Found
 *       500:
 *          description: Internal Server Error
 */
route.put(
    '/posts/:id',
    updatePostValidator,
    requestValidatorMiddleware,
    updatePostHandler
);

/**
 * @openapi
 * /posts/{id}:
 *  patch:
 *   tags:
 *    - Posts
 *   security:
 *     - bearerAuth: []
 *   summary: API for patching a post
 *   description: API for patching a post
 *   headers:
 *     Authorization:
 *       schema:
 *         type: string
 *       description: Bearer token
 *   parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        default: 1
 *        required: true
 *        description: The id of the post
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *          $ref: '#/components/schemas/PatchPost'
 *   responses:
 *     200:
 *       description: Returns updated post.
 *       content:
 *        application/json:
 *         schema:
 *           $ref: '#/components/schemas/Post'
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 *     500:
 *       description: Internal Server Error
 */
route.patch(
    '/posts/:id',
    patchPostValidator,
    requestValidatorMiddleware,
    patchPostHandler
);

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     security:
 *        - bearerAuth: []
 *     tags:
 *       - Posts
 *     summary: API for deleting a post
 *     description: API for deleting a post
 *     headers:
 *        Authorization:
 *          schema:
 *            type: string
 *          description: Bearer token
 *     parameters:
 *        - in: path
 *          name: id
 *          type: number
 *          default: 1
 *          required: true
 *          description: The id of the post
 *     responses:
 *       200:
 *         description: Returns a successful message.
 *         content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 default: Post deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
route.delete(
    '/posts/:id',
    deletePostValidator,
    requestValidatorMiddleware,
    deletePostHandler
);




export default route;