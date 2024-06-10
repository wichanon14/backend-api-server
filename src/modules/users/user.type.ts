/**
 * User type
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        name:
 *          type: string
 *          default: Leanne Graham
 *        username:
 *          type: string
 *          default: Bret
 *        email:
 *          type: string
 *          default:
 *        addressId:
 *          type: number
 *          default: 1
 *        phone:
 *          type: string
 *          default: 0987654321
 *        website:
 *          type: string
 *          default: hildegard.org
 *        companyID:
 *          type: number
 *          default: 1
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */
export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    addressId: number;
    phone: string;
    website: string;
    companyID: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Users type
 * @openapi
 * components:
 *  schemas:
 *    Users:
 *      type: array
 *      items:
 *         $ref: '#/components/schemas/User'
 */
export type Users = User[];

/**
 * Address type
 * @openapi
 * components:
 *  schemas:
 *    Address:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        street:
 *          type: string
 *          default: Kulas Light
 *        suite:
 *          type: string
 *          default: Apt. 556
 *        city:
 *          type: string
 *          default: Gwenborough
 *        zipcode:
 *          type: string
 *          default: 10900
 *        geoId:
 *          type: number
 *          default: 1
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */
export type Address = {
    id: number;
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geoId: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Geo type
 * @openapi
 * components:
 *  schemas:
 *    Geo:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        lat:
 *          type: string
 *          default: -37.3159
 *        lng:
 *          type: string
 *          default: 81.1496
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */
export type Geo = {
    id: number;
    lat: string;
    lng: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Company type
 * @openapi
 * components:
 *  schemas:
 *    Company:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        name:
 *          type: string
 *          default: Romaguera-Crona
 *        catchPhrase:
 *          type: string
 *          default: Multi-layered client-server neural-net
 *        bs:
 *          type: string
 *          default: harness real-time e-markets
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */
export type Company = {
    id: number;
    name: string;
    catchPhrase: string;
    bs: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Full User
 * @openapi
 * components:
 *  schemas:
 *    FullUser:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          default: 1
 *        name:
 *          type: string
 *          default: Leanne Graham
 *        username:
 *          type: string
 *          default: Bret
 *        email:
 *          type: string
 *          default: test@test.com
 *        address:
 *          $ref: '#/components/schemas/Address'
 *        phone:
 *          type: string
 *          default: 0987654321
 *        website:
 *          type: string
 *          default: hildegard.org
 *        company:
 *          $ref: '#/components/schemas/Company'
 *        createdAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 *        updatedAt:
 *          type: date
 *          default: 2024-07-24T23:59:59.000Z
 */