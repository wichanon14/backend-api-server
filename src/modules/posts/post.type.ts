/**
 * @openapi
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        title:
 *          type: string
 *          default: title
 *        body:
 *          type: string
 *          default: body
 *        userId:
 *          type: number
 *          default: 1
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */
export type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Posts:
 *      type: array
 *      items:
 *         $ref: '#/components/schemas/Post'
 */
export type Posts = Post[];