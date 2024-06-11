import { body, param, query } from 'express-validator';

export const listUsersValidator = [
    query("name").optional().isString().withMessage("Name must be a string"),
    query("username").optional().isString().withMessage("Username must be a string"),
    query("email").optional().isString().withMessage("Email must be a valid email"),
    query("phone").optional().isString().withMessage("Phone must be a string"),
    query("website").optional().isString().withMessage("Website must be a string"),
    query("addressId").optional().isInt().withMessage("Address ID must be an integer"),
    query("companyId").optional().isInt().withMessage("Company ID must be an integer"),
]

export const listUserPostsValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    query("title").optional().isString().withMessage("Title must be a string"),
    query("body").optional().isString().withMessage("Body must be a string"),
]

export const getUserValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
]

export const getUserAddressValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    query("street").optional().isString().withMessage("Street must be a string"),
    query("suite").optional().isString().withMessage("Suite must be a string"),
    query("city").optional().isString().withMessage("City must be a string"),
    query("zipcode").optional().isString().withMessage("Zipcode must be a string"),
]

export const getUserAddressGeoValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    param("addressId").isInt().notEmpty().withMessage("Address ID must be an integer and not empty"),
    query("lat").optional().isString().withMessage("Latitude must be a string"),
    query("lng").optional().isString().withMessage("Longitude must be a string"),
]

export const getUserCompanyValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    query("name").optional().isString().withMessage("Name must be a string"),
    query("catchPhrase").optional().isString().withMessage("Catch phrase must be a string"),
    query("bs").optional().isString().withMessage("BS must be a string"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUser:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Leanne Graham
 *        username:
 *          type: string
 *          default: Bret
 *        email:
 *          type: string
 *          default: test@test.com
 *        phone:
 *          type: string
 *          default: 0987654321
 *        website:
 *          type: string
 *          default: hildegard.org
 *        address:
 *          $ref: '#/components/schemas/UpdateUserAddress'
 *        company:
 *          $ref: '#/components/schemas/CreateUserAddressAndGeo'
 *
 */
export const createUserValidator = [
    body("name").isString().notEmpty().withMessage("Name must be a string and not empty"),
    body("username").isString().notEmpty().withMessage("Username must be a string and not empty"),
    body("email").isEmail().notEmpty().withMessage("Email must be a valid email and not empty"),
    body("phone").isString().notEmpty().withMessage("Phone must be a string and not empty"),
    body("website").isString().notEmpty().withMessage("Website must be a string and not empty"),
    body("address.street").isString().notEmpty().withMessage("Street must be a string and not empty"),
    body("address.suite").isString().notEmpty().withMessage("Suite must be a string and not empty"),
    body("address.city").isString().notEmpty().withMessage("City must be a string and not empty"),
    body("address.zipcode").isString().notEmpty().withMessage("Zipcode must be a string and not empty"),
    body("address.geo.lat").isString().notEmpty().withMessage("Latitude must be a string and not empty"),
    body("address.geo.lng").isString().notEmpty().withMessage("Longitude must be a string and not empty"),
    body("company.name").isString().notEmpty().withMessage("Company name must be a string and not empty"),
    body("company.catchPhrase").isString().notEmpty().withMessage("Catch phrase must be a string and not empty"),
    body("company.bs").isString().notEmpty().withMessage("BS must be a string and not empty"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUser:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Leanne Graham
 *        username:
 *          type: string
 *          default: Bret
 *        email:
 *          type: string
 *          default: test@test.com
 *        phone:
 *          type: string
 *          default: 0987654321
 *        website:
 *          type: string
 *          default: hildegard.org
 */
export const updateUserValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("username").optional().isString().withMessage("Username must be a string"),
    body("email").optional().isEmail().withMessage("Email must be a valid email"),
    body("phone").optional().isString().withMessage("Phone must be a string"),
    body("website").optional().isString().withMessage("Website must be a string")
]

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUserAddress:
 *      type: object
 *      properties:
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
 */
export const updateUserAddressValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("street").optional().isString().withMessage("Street must be a string"),
    body("suite").optional().isString().withMessage("Suite must be a string"),
    body("city").optional().isString().withMessage("City must be a string"),
    body("zipcode").optional().isString().withMessage("Zipcode must be a string"),
]
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserAddressAndGeo:
 *      type: object
 *      properties:
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
 *        geo:
 *          $ref: '#/components/schemas/UpdateUserAddressGeo'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUserAddressGeo:
 *      type: object
 *      properties:
 *        lat:
 *          type: string
 *          default: -37.3159
 *        lng:
 *          type: string
 *          default: 81.1496
 */
export const updateUserAddressGeoValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    param("addressId").isInt().notEmpty().withMessage("Address ID must be an integer and not empty"),
    body("lat").optional().isString().withMessage("Latitude must be a string"),
    body("lng").optional().isString().withMessage("Longitude must be a string"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    UpdateUserCompany:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Romaguera-Crona
 *        catchPhrase:
 *          type: string
 *          default: Multi-layered client-server neural-net
 *        bs:
 *          type: string
 *          default: harness real-time e-markets
 */
export const updateUserCompanyValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("catchPhrase").optional().isString().withMessage("Catch phrase must be a string"),
    body("bs").optional().isString().withMessage("BS must be a string"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    PatchUser:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Leanne Graham
 *        username:
 *          type: string
 *          default: Bret
 *        email:
 *          type: string
 *          default: test@test.com
 *        phone:
 *          type: string
 *          default: 0987654321
 *        website:
 *          type: string
 *          default: hildegard.org
 */
export const patchUserValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("username").optional().isString().withMessage("Username must be a string"),
    body("email").optional().isEmail().withMessage("Email must be a valid email"),
    body("phone").optional().isString().withMessage("Phone must be a string"),
    body("website").optional().isString().withMessage("Website must be a string"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    PatchUserAddress:
 *      type: object
 *      properties:
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
 */
export const patchUserAddressValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("street").optional().isString().withMessage("Street must be a string"),
    body("suite").optional().isString().withMessage("Suite must be a string"),
    body("city").optional().isString().withMessage("City must be a string"),
    body("zipcode").optional().isString().withMessage("Zipcode must be a string"),
]

/**
 * @openapi
 * components:
 *  schemas:
 *    PatchUserCompany:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Romaguera-Crona
 *        catchPhrase:
 *          type: string
 *          default: Multi-layered client-server neural-net
 *        bs:
 *          type: string
 *          default: harness real-time e-markets
 */
export const patchUserCompanyValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("catchPhrase").optional().isString().withMessage("Catch phrase must be a string"),
    body("bs").optional().isString().withMessage("BS must be a string"),
]

export const deleteUserValidator = [
    param("id").isInt().notEmpty().withMessage("ID must be an integer and not empty"),
]