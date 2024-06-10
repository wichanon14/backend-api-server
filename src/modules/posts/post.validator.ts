import { body, param, query } from 'express-validator';


export const listPostsValidator = [
    query("title").optional().isString().withMessage("Title must be a string"),
    query("body").optional().isString().withMessage("Body must be a string"),
    query("userId").optional().isInt().withMessage("User ID must be an integer"),
]

export const getPostValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    CreatePost:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          default: title
 *        body:
 *          type: string
 *          default: body
 *        userId:
 *          type: number
 *          default: 1
 */
export const createPostValidator = [
    body("title").isString().notEmpty().withMessage("Title must be a string and not empty"),
    body("body").isString().notEmpty().withMessage("Body must be a string and not empty"),
    body("userId").isInt().notEmpty().withMessage("User ID must be an integer and not empty"),
]

/**
* @openapi
* components:
*  schemas:
*    UpdatePost:
*      type: object
*      properties:
*        title:
*          type: string
*          default: title
*        body:
*          type: string
*          default: body
*        userId:
*          type: number
*          default: 1
*/
export const updatePostValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("title").isString().notEmpty().withMessage("Title must be a string and not empty"),
    body("body").isString().notEmpty().withMessage("Body must be a string and not empty"),
    body("userId").isInt().notEmpty().withMessage("User ID must be an integer and not empty"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    PatchPost:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          default: title
 *        body:
 *          type: string
 *          default: body
 *        userId:
 *          type: number
 *          default: 1
 */
export const patchPostValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("title").optional().isString().withMessage("Title must be a string"),
    body("body").optional().isString().withMessage("Body must be a string"),
    body("userId").optional().isInt().withMessage("User ID must be an integer"),
]

export const deletePostValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
]