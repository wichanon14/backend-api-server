import { AppError, HttpStatus } from '../libs/error';
import { server } from '../server';
import request from 'supertest';
import * as prismaMock from '../libs/prisma';
import { User } from '@prisma/client';

jest.mock('../libs/validateToken', () => {
    return {
        validateToken: jest.fn().mockResolvedValue(true)
    }
});

jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                $connect: jest.fn().mockResolvedValue({}),
                $transaction: jest.fn().mockResolvedValue({}),
                user: {
                    create: jest.fn(),
                    findUnique: jest.fn(),
                    findMany: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                address: {
                    findUnique: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                geo:{
                    findUnique: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                company:{
                    findUnique: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                $disconnect: jest.fn(),
            }
        })
    }
})

const resultUserSuccessful = {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "addressId": 1,
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "companyId": 1,
    "createdAt": "2024-06-08T10:25:31.860Z" as unknown as Date,
    "updatedAt": "2024-06-08T10:25:31.860Z" as unknown as Date
}

const resultAddressSuccessful ={
    "id": 1,
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    geoId: 1,
    "zipcode": "92998-3874",
    "createdAt": "2024-06-08T10:25:31.860Z" as unknown as Date,
    "updatedAt": "2024-06-08T10:25:31.860Z" as unknown as Date
}

const resultGeoSuccessful = {
    id: 1,
    lat: "-37.3159",
    lng: "81.1496",
    createdAt: "2024-06-08T10:25:31.860Z" as unknown as Date,
    updatedAt: "2024-06-08T10:25:31.860Z" as unknown as Date
}

const resultCompanySuccessful = {
    id: 1,
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered",
    bs: "harness real-time e-markets",
    createdAt: "2024-06-08T10:25:31.860Z" as unknown as Date,
    updatedAt: "2024-06-08T10:25:31.860Z" as unknown as Date
}
    

const resultInternalServerError = {status:'error', msg: 'Internal server error'}

describe('User Route', () => {
    afterAll(()=>{
        server.close();
        jest.resetAllMocks();
    })

    describe('GET /users', () => {
        it('should return 200 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findMany').mockResolvedValue([resultUserSuccessful]);
            
            const response = await request(server).get('/users?name=Leanne Graham&username=a&email=test&phone=1234567890&website=www.test.com&addressId=1&companyId=1')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual([resultUserSuccessful]);
        });

        it('should return 400 status code', async () => {
            const response = await request(server).get('/users?name=Leanne Graham&username=a&email=test&phone=1234567890&website=www.test.com&addressId=abc&companyId=abc')
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                   {
                    "location": "query",
                    "msg": "Address ID must be an integer",
                    "path": "addressId",
                    "type": "field",
                    "value": "abc"
                  },
                   {
                    "location": "query",
                    "msg": "Company ID must be an integer",
                    "path": "companyId",
                    "type": "field",
                    "value": "abc"
                  }
                ]
              });
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findMany').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).get('/users')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        });
    })

    describe('GET /users/:id', () => {
        it('should return 200 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            
            const response = await request(server).get('/users/1')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultUserSuccessful);
        });

        it('should return 400 status code', async () => {
            const response = await request(server).get('/users/abc')
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                   {
                    "location": "params",
                    "msg": "Invalid value",
                    "path": "id",
                    "value": "abc",
                    "type":"field"
                  }
                ]
              });
        })

        it('should return 404 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
            
            const response = await request(server).get('/users/2')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual({
                "status": "error",
                "msg": "User not found"
            });
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).get('/users/1')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        });
    })

    describe('GET /users/:id/address', () => {
        it('should return 200 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            jest.spyOn(prismaMock.prisma.address, 'findUnique').mockResolvedValue(resultAddressSuccessful);
            
            const response = await request(server).get('/users/1/address')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultAddressSuccessful);
        });

        it('should return 400 status code', async () => {
            const response = await request(server).get('/users/abc/address')
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                   {
                    "location": "params",
                    "msg": "Invalid value",
                    "path": "id",
                    "value": "abc",
                    "type":"field"
                  }
                ]
              });
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).get('/users/2/address')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })
            it('Address not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.address, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).get('/users/1/address')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Address not found"
                });
            })
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).get('/users/1/address')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        });
    })

    describe('GET /users/:id/address/:addressId/geo', () => {
        it('should return 200 status code', async () => {            
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(
                {
                    ...resultUserSuccessful,
                    address:resultAddressSuccessful
                } as User
            );
            jest.spyOn(prismaMock.prisma.geo, 'findUnique').mockResolvedValue(resultGeoSuccessful);
            
            const response = await request(server).get('/users/1/address/1/geo')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultGeoSuccessful);
        });

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).get('/users/abc/address/1/geo')
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                    {
                        "location": "params",
                        "msg": "Invalid value",
                        "path": "id",
                        "value": "abc",
                        "type":"field"
                    }
                    ]
                });
            })
            it('Invalid address id', async () => {
                const response = await request(server).get('/users/1/address/abc/geo')
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "addressId",
                            "value": "abc",
                            "type":"field"
                        }
                    ]    
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
            
                const response = await request(server).get('/users/2/address/1/geo')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Geo not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(
                    {
                        ...resultUserSuccessful,
                        address:resultAddressSuccessful
                    } as User
                );
                jest.spyOn(prismaMock.prisma.geo, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).get('/users/1/address/1/geo')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Geo not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).get('/users/1/address/1/geo')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in geo findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(
                    {
                        ...resultUserSuccessful,
                        address:resultAddressSuccessful
                    } as User
                );
                jest.spyOn(prismaMock.prisma.geo, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).get('/users/1/address/1/geo')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('GET /users/:id/company', () => {
        it('should return 200 status code', async () => {
                
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.company, 'findUnique').mockResolvedValue(resultCompanySuccessful);
                
                const response = await request(server).get('/users/1/company')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toEqual(resultCompanySuccessful);
        })

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).get('/users/abc/company')
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "id",
                            "value": "abc",
                            "type":"field"
                        }
                    ]
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).get('/users/2/company')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Company not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.company, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).get('/users/1/company')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Company not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).get('/users/1/company')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in company findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.company, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).get('/users/1/company')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('POST /users', () => {
        it('should return 201 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'create').mockResolvedValue(resultUserSuccessful);
            
            const response = await request(server).post('/users')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                    address:{
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                        geo:{
                            lat: "-37.3159",
                            lng: "81.1496"
                        }
                    },
                    company:{
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    }
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body).toEqual(resultUserSuccessful);
        });

        it('should return 400 status code', async () => {
            const response = await request(server).post('/users')
                .send({
                    name: "Bret",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com"
                })
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.street",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Street must be a string and not empty",
                     "path": "address.street",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.suite",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Suite must be a string and not empty",
                     "path": "address.suite",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.city",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "City must be a string and not empty",
                     "path": "address.city",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.zipcode",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Zipcode must be a string and not empty",
                     "path": "address.zipcode",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.geo.lat",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Latitude must be a string and not empty",
                     "path": "address.geo.lat",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "address.geo.lng",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Longitude must be a string and not empty",
                     "path": "address.geo.lng",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "company.name",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Company name must be a string and not empty",
                     "path": "company.name",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "company.catchPhrase",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Catch phrase must be a string and not empty",
                     "path": "company.catchPhrase",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "Invalid value",
                     "path": "company.bs",
                     "type": "field",
                   },
                    {
                     "location": "body",
                     "msg": "BS must be a string and not empty",
                     "path": "company.bs",
                     "type": "field",
                   },
                 ]
            });
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'create').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).post('/users')
            .send({
                name: "Leanne Graham",
                username: "Bret",
                email: "test@test.com",
                phone: "1234567890",
                website: "www.test.com",
                address:{
                    street: "Kulas Light",
                    suite: "Apt. 556",
                    city: "Gwenborough",
                    zipcode: "92998-3874",
                    geo:{
                        lat: "-37.3159",
                        lng: "81.1496"
                    }
                },
                company:{
                    name: "Romaguera-Crona",
                    catchPhrase: "Multi-layered",
                    bs: "harness real-time e-markets"
                }
            })
            .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        });
    })

    describe('PUT /users/:id', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            jest.spyOn(prismaMock.prisma.user, 'update').mockResolvedValue(resultUserSuccessful);
            
            const response = await request(server).put('/users/1')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultUserSuccessful);
        });

        it('should return 400 status code', async () => {
            const response = await request(server).put('/users/abc')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                    {
                        "location": "params",
                        "msg": "Invalid value",
                        "path": "id",
                        "value": "abc",
                        "type":"field"
                    }
                ]
            });
        })

        it('should return 404 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
            
            const response = await request(server).put('/users/2')
            .send({
                name: "Leanne Graham",
                username: "Bret",
                email: "test@test.com",
                phone: "1234567890",
                website: "www.test.com",
            })
            .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual({
                "status": "error",
                "msg": "User not found"
            });
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            jest.spyOn(prismaMock.prisma.user, 'update').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).put('/users/1')
            .send({
                name: "Leanne Graham",
                username: "Bret",
                email: "test@test.com",
                phone: "1234567890",
                website: "www.test.com",
            })
            .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        });
    })

    describe('PUT /users/:id/address', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                address:resultAddressSuccessful
            } as User);
            jest.spyOn(prismaMock.prisma.address, 'update').mockResolvedValue(resultAddressSuccessful);
            
            const response = await request(server).put('/users/1/address')
                .send({
                    street: "Kulas Light",
                    suite: "Apt. 556",
                    city: "Gwenborough",
                    zipcode: "92998-3874",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultAddressSuccessful);
        })

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).put('/users/abc/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "id",
                            "value": "abc",
                            "type":"field"
                        }
                    ]
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/2/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Address not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.address, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Address not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in address update', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    address:resultAddressSuccessful
                } as User);
                jest.spyOn(prismaMock.prisma.address, 'update').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('PUT /users/:id/address/:addressId/geo', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                address:{
                    ...resultAddressSuccessful,
                    geo:resultGeoSuccessful
                }
            } as User);
            jest.spyOn(prismaMock.prisma.geo, 'update').mockResolvedValue(resultGeoSuccessful);
            
            const response = await request(server).put('/users/1/address/1/geo')
                .send({
                    lat: "-37.3159",
                    lng: "81.1496"
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultGeoSuccessful);
        })

        it('should return 400 status code', async () => {
            const response = await request(server).put('/users/abc/address/1/geo')
                .send({
                    lat: "-37.3159",
                    lng: "81.1496"
                })
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                    {
                        "location": "params",
                        "msg": "Invalid value",
                        "path": "id",
                        "value": "abc",
                        "type":"field"
                    }
                ]
            });
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/2/address/1/geo')
                    .send({
                        lat: "-37.3159",
                        lng: "81.1496"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Geo not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    address:resultAddressSuccessful
                } as User);
                jest.spyOn(prismaMock.prisma.geo, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/1/address/1/geo')
                    .send({
                        lat: "-37.3159",
                        lng: "81.1496"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Geo not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/address/1/geo')
                    .send({
                        lat: "-37.3159",
                        lng: "81.1496"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in geo update', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    address:{
                        ...resultAddressSuccessful,
                        geo:resultGeoSuccessful
                    }
                } as User);
                jest.spyOn(prismaMock.prisma.geo, 'update').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/address/1/geo')
                    .send({
                        lat: "-37.3159",
                        lng: "81.1496"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('PUT /users/:id/company', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                company:resultCompanySuccessful
            } as User);
            jest.spyOn(prismaMock.prisma.company, 'update').mockResolvedValue(resultCompanySuccessful);
            
            const response = await request(server).put('/users/1/company')
                .send({
                    name: "Romaguera-Crona",
                    catchPhrase: "Multi-layered",
                    bs: "harness real-time e-markets"
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultCompanySuccessful);
        })

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).put('/users/abc/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "id",
                            "value": "abc",
                            "type":"field"
                        }
                    ]
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/2/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Company not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.company, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).put('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Company not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in company update', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    company:resultCompanySuccessful
                } as User);
                jest.spyOn(prismaMock.prisma.company, 'update').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).put('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('PATCH /users/:id', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            jest.spyOn(prismaMock.prisma.user, 'update').mockResolvedValue(resultUserSuccessful);
            
            const response = await request(server).patch('/users/1')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultUserSuccessful);
        })
        it('should return 400 status code', async () => {
            const response = await request(server).patch('/users/abc')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                    {
                        "location": "params",
                        "msg": "Invalid value",
                        "path": "id",
                        "value": "abc",
                        "type":"field"
                    }
                ]
            })
        })

        it('should return 404 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
            
            const response = await request(server).patch('/users/2')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual({
                "status": "error",
                "msg": "User not found"
            });
        })

        it('should return 500 status code', async () => {

            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
            jest.spyOn(prismaMock.prisma.user, 'update').mockRejectedValue(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )
            
            const response = await request(server).patch('/users/1')
                .send({
                    name: "Leanne Graham",
                    username: "Bret",
                    email: "test@test.com",
                    phone: "1234567890",
                    website: "www.test.com",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        })
    })

    describe('PATCH /users/:id/address', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                address:resultAddressSuccessful
            } as User);
            jest.spyOn(prismaMock.prisma.address, 'update').mockResolvedValue(resultAddressSuccessful);
            
            const response = await request(server).patch('/users/1/address')
                .send({
                    street: "Kulas Light",
                    suite: "Apt. 556",
                    city: "Gwenborough",
                    zipcode: "92998-3874",
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultAddressSuccessful);
        })

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).patch('/users/abc/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "id",
                            "value": "abc",
                            "type":"field"
                        }
                    ]
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).patch('/users/2/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Address not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.address, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).patch('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Address not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).patch('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in address update', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    address:resultAddressSuccessful
                } as User);
                jest.spyOn(prismaMock.prisma.address, 'update').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).patch('/users/1/address')
                    .send({
                        street: "Kulas Light",
                        suite: "Apt. 556",
                        city: "Gwenborough",
                        zipcode: "92998-3874",
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('PATCH /users/:id/company', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                company:resultCompanySuccessful
            } as User);
            jest.spyOn(prismaMock.prisma.company, 'update').mockResolvedValue(resultCompanySuccessful);
            
            const response = await request(server).patch('/users/1/company')
                .send({
                    name: "Romaguera-Crona",
                    catchPhrase: "Multi-layered",
                    bs: "harness real-time e-markets"
                })
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultCompanySuccessful);
        })

        describe('should return 400 status code', () => {
            it('Invalid user id', async () => {
                const response = await request(server).patch('/users/abc/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "params",
                            "msg": "Invalid value",
                            "path": "id",
                            "value": "abc",
                            "type":"field"
                        }
                    ]
                });
            })

            it('Invalid company name', async () => {
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: 123,
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "body",
                            "msg": "Name must be a string",
                            "path": "name",
                            "type": "field",
                            "value": 123
                        }
                    ]
                });
            })

            it('Invalid catchPhrase', async () => {
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: 123,
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "body",
                            "msg": "Catch phrase must be a string",
                            "path": "catchPhrase",
                            "type": "field",
                            "value": 123
                        }
                    ]
                });
            })

            it('Invalid bs', async () => {
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: 123
                    })
                    .set('Authorization','Bearer token');
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual({
                    "errors": [
                        {
                            "location": "body",
                            "msg": "BS must be a string",
                            "path": "bs",
                            "type": "field",
                            "value": 123
                        }
                    ]
                });
            })
        })

        describe('should return 404 status code', () => {
            it('User not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).patch('/users/2/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "User not found"
                });
            })

            it('Company not found', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(resultUserSuccessful);
                jest.spyOn(prismaMock.prisma.company, 'findUnique').mockResolvedValue(null);
                
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.NOT_FOUND);
                expect(response.body).toEqual({
                    "status": "error",
                    "msg": "Company not found"
                });
            })
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in company update', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    company:resultCompanySuccessful
                } as User);
                jest.spyOn(prismaMock.prisma.company, 'update').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).patch('/users/1/company')
                    .send({
                        name: "Romaguera-Crona",
                        catchPhrase: "Multi-layered",
                        bs: "harness real-time e-markets"
                    })
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })

    describe('DELETE /users/:id', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                ...resultUserSuccessful,
                address:{
                    ...resultAddressSuccessful,
                    geo:resultGeoSuccessful
                }
            } as User);
            jest.spyOn(prismaMock.prisma, '$transaction').mockResolvedValue({});
            
            const response = await request(server).delete('/users/1')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({
                msg: "User deleted"
            });
        })

        it('should return 400 status code', async () => {
            const response = await request(server).delete('/users/abc')
                .set('Authorization','Bearer token');
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({
                "errors": [
                    {
                        "location": "params",
                        "msg": "Invalid value",
                        "path": "id",
                        "value": "abc",
                        "type":"field"
                    }
                ]
            });
        })

        it('should return 404 status code', async () => {
            jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue(null);
            
            const response = await request(server).delete('/users/2')
                .set('Authorization', 'Bearer token');
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual({
                "status": "error",
                "msg": "User not found"
            });
        })

        describe('should return 500 status code', () => {
            it('Error in user findUnique', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).delete('/users/1')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })

            it('Error in transaction', async () => {
                jest.spyOn(prismaMock.prisma.user, 'findUnique').mockResolvedValue({
                    ...resultUserSuccessful,
                    address:{
                        ...resultAddressSuccessful,
                        geo:resultGeoSuccessful
                    }
                } as User);
                jest.spyOn(prismaMock.prisma, '$transaction').mockRejectedValue(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )
                
                const response = await request(server).delete('/users/1')
                    .set('Authorization', 'Bearer token');
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        })
    })
});