import { NextFunction, Request, Response } from "express";
import { transformQueryToWhere } from "../../libs/object.util";
import { prisma } from "../../libs/prisma";
import { AppError, HttpStatus } from "../../libs/error";
import { logger } from "../../libs/pino";

export const listUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the query parameters from the request
    const query = req.query;

    // transform the query to where object
    const where = transformQueryToWhere(query, [
        { key: 'name', type: 'text' },
        { key: 'username', type: 'text' },
        { key: 'email', type: 'text' },
        { key: 'phone', type: 'text' },
        { key: 'website', type: 'text' },
        { key: 'addressId', type: 'number' },
        { key: 'companyId', type: 'number'}
    ]);

    try {
        // query the users from the database and filter them
        const result = await prisma.user.findMany({
            where
        });

        // return the list of users
        return res.send(result).end()
    } catch (err) {
        logger.error('listUsers error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const listUserPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;
    const where = transformQueryToWhere(req.query, [
        { key: 'title', type: 'text' },
        { key: 'body', type: 'text' }
    ])

    try {

        // check if the user exists
        const isFoundUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId, 10)
            }
        });

        if (!isFoundUser) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        // query the posts from the database
        const result = await prisma.post.findMany({
            where: {
                ...where,
                userId: parseInt(userId, 10)
            }
        });

        // return the list of posts
        return res.send(result).end();
    } catch (err) {
        logger.error('listUserPosts error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }

}

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user id from the request
    const userId = req.params.id;

    // query the user from the database
    try {
        const result = await prisma.user.findUnique({
            include:{
                address:{
                    include:{
                        geo:true
                    }
                },
                company:true
            },
            where: {
                id: parseInt(userId,10)
            }
        });

        // check if the user is found
        if (!result) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        // return the user
        return res.send(result).end();
    } catch (err) {
        logger.error('getUser error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }

}

export const getUserAddressHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user id from the request
    const userId = req.params.id;

    // query the address from the database
    try {

        const isFoundUser = await prisma.user.findUnique({
            where:{
                id:parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        const result = await prisma.address.findUnique({
            where: {
                id: isFoundUser.id
            }
        });

        // check if the address is found
        if (!result) {
            return next(new AppError('Address not found', HttpStatus.NOT_FOUND))
        }

        // return the address
        return res.send(result).end();
    } catch (err) {
        logger.error('getUserAddress error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }



}

export const getUserAddressGeoHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user id and address id from the request
    const userId = req.params.id;
    const addressId = req.params.addressId;

    // query the geo from the database
    try {
        const isFoundUser = await prisma.user.findUnique({
            include:{address:true},
            where:{
                id:parseInt(userId, 10),
                addressId:parseInt(addressId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        const result = await prisma.geo.findUnique({
            where: {
                id: isFoundUser.address.geoId
            }
        });

        // check if the geo is found
        if (!result) {
            return next(new AppError('Geo not found', HttpStatus.NOT_FOUND))
        }

        // return the geo
        return res.send(result).end();
    } catch (err) {
        logger.error('getUserAddressGeo error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const getUserCompanyHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;

    // query the company from the database
    try {
        const isFoundUser = await prisma.user.findUnique({
            where:{
                id:parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        const result = await prisma.company.findUnique({
            where: {
                id: isFoundUser.companyId
            }
        });

        // check if the company is found
        if (!result) {
            return next(new AppError('Company not found', HttpStatus.NOT_FOUND))
        }

        // return the company
        return res.send(result).end();
    } catch (err) {
        logger.error('getUserCompany error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user data from the request
    const userData = req.body;
    const addressData = userData.address;
    const geoData = addressData.geo;
    delete addressData.geo;
    delete userData.address;
    const companyData = userData.company;
    delete userData.company;

    try {
        // create the user in the database
        const result = await prisma.user.create({
            data: {
                ...userData,
                company:{
                    create:companyData
                },
                address:{
                    create:{
                        ...addressData,
                        geo:{
                            create:geoData
                        }
                    }
                },
            }
        });

        // return the created user
        return res.status(HttpStatus.CREATED).send(result).end();
    } catch (err) {
        logger.error('createUser error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }

}

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user id from the request
    const userId = req.params.id;
    // get the user data from the request
    const userData = req.body;

    try {

        const isFoundUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        // update the user in the database
        const result = await prisma.user.update({
            where: {
                id: parseInt(userId, 10)
            },
            data: userData
        });

        // return the updated user
        return res.send(result).end();
    } catch (err) {
        logger.error('updateUser error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const updateUserAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;
    // get the address data from the request
    const addressData = req.body;

    try {
        // check if the user and address exists
        const isFoundUser = await prisma.user.findUnique({
            include:{address:true},
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        if( !isFoundUser.address ) {
            return next(new AppError('Address not found', HttpStatus.NOT_FOUND))
        }

        // update the address in the database
        const result = await prisma.address.update({
            where: {
                id: isFoundUser.addressId
            },
            data: addressData
        });

        // return the updated address
        return res.send(result).end();
    } catch (err) {
        logger.error('updateUserAddress error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const updateUserAddressGeoHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id, address id and geo id from the request
    const userId = req.params.id;
    const addressId = req.params.addressId;
    // get the geo data from the request
    const geoData = req.body;

    try {
        // check if the user address and geo exists
        const isFoundUser = await prisma.user.findUnique({
            include:{
                address:{
                    include:{
                        geo:true
                    }
            
                }
            },
            where: {
                id: parseInt(userId, 10),
                addressId: parseInt(addressId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        if( !isFoundUser.address.geo ) {
            return next(new AppError('Geo not found', HttpStatus.NOT_FOUND))
        }

        // update the address geo in the database
        const result = await prisma.geo.update({
            where: {
                id: isFoundUser.address.geoId
            },
            data: geoData
        });

        // return the updated address geo
        return res.send(result).end();
    } catch (err) {
        logger.error('updateUserAddressGeo error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const updateUserCompanyHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;
    // get the company data from the request
    const companyData = req.body;
    try {
        // check if the user and company exists
        const isFoundUser = await prisma.user.findUnique({
            include:{
                company:true
            },
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        if( !isFoundUser.company ) {
            return next(new AppError('Company not found', HttpStatus.NOT_FOUND))
        }

        // update the company in the database
        const result = await prisma.company.update({
            where: {
                id: isFoundUser.companyId
            },
            data: companyData
        });

        // return the updated company
        return res.send(result).end();
    }catch(err){
        logger.error('updateUserCompany error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const patchUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the user id from the request
    const userId = req.params.id;
    // get the user data from the request
    const userData = req.body;

    try {
        // check if the user exists
        const isFoundUser = await prisma.user.findUnique({
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        // update the user in the database
        const result = await prisma.user.update({
            where: {
                id: parseInt(userId, 10)
            },
            data: userData
        });

        // return the updated user
        return res.send(result).end();
    } catch (err) {
        logger.error('patchUser error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }

}

export const patchUserAddressHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;
    // get the address data from the request
    const addressData = req.body;

    try {
        // check if the user and address exists
        const isFoundUser = await prisma.user.findUnique({
            include:{
                address:true,
            },
            where: {
                id: parseInt(userId, 10),
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }
        if( !isFoundUser.address ) {
            return next(new AppError('Address not found', HttpStatus.NOT_FOUND))
        }

        // update the address in the database
        const result = await prisma.address.update({
            where: {
                id: isFoundUser.addressId
            },
            data: addressData
        });

        // return the updated address
        return res.send(result).end();
    } catch (err) {
        logger.error('patchUserAddress error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const patchUserCompanyHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;
    // get the company data from the request
    const companyData = req.body;
    try {
        // check if the user and company exists
        const isFoundUser = await prisma.user.findUnique({
            include:{
                company:true
            },
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        if( !isFoundUser.company ) {
            return next(new AppError('Company not found', HttpStatus.NOT_FOUND))
        }

        // update the company in the database
        const result = await prisma.company.update({
            where: {
                id: isFoundUser.companyId
            },
            data: companyData
        });

        // return the updated company
        return res.send(result).end();
    }catch(err){
        logger.error('patchUserCompany error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    // get the user id from the request
    const userId = req.params.id;

    try {
        // check if the user exists
        const isFoundUser = await prisma.user.findUnique({
            include:{
                address:{
                    include:{
                        geo:true
                    }
                }
            },
            where: {
                id: parseInt(userId, 10)
            }
        });

        if( !isFoundUser ) {
            return next(new AppError('User not found', HttpStatus.NOT_FOUND))
        }

        // delete the user from the database
        // delete all related data first
        await prisma.$transaction([
            // 1. delete User data
            prisma.user.delete({
                where:{
                    id:isFoundUser.id
                }
            }),
            // 2. delete Address data
            prisma.address.delete({
                where:{
                    id:isFoundUser.addressId
                }
            }),
            // 3. delete Geo data
            prisma.geo.delete({
                where:{
                    id:isFoundUser.address.geoId
                }
            }),
            // 4. delete Company data
            prisma.company.delete({
                where:{
                    id:isFoundUser.companyId
                }
            }),
        ]);

        // return the deleted user
        return res.send({
            msg:'User deleted'
        }).end();
    } catch (err) {
        logger.error('deleteUser error', err);
        return next(new AppError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR))
    }
}