import { AppError, HttpStatus } from '../libs/error';
import { server } from '../server';
import request from 'supertest';
import { Post } from '@prisma/client';

jest.mock('../libs/validateToken', () => {
    return {
        validateToken: jest.fn().mockReturnValue(true)
    }
});

jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                $connect: jest.fn().mockResolvedValue({}),
                post: {
                    findMany: jest.fn(),
                    findUnique: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                $disconnect: jest.fn()
            }
        })
    }
})

const resultSuccessful : Post = {
    id:1,
    title:'Post 1',
    body:'Body 1',
    userId:1,
    createdAt: '2024-01-01' as unknown as Date,
    updatedAt: '2024-01-01' as unknown as Date
}

const resultInternalServerError = {
    status:'error',
    msg: 'Internal server error'
}

const resultNotFound = {
    status:'error',
    msg: 'Post not found'
}

const resultValidationErrorRequiredField = {
    "errors": [
        {"location": "body", "msg": "Invalid value", "path": "title", "type": "field", "value": 123}, 
        {"location": "body", "msg": "Invalid value", "path": "body", "type": "field", "value": 123}, 
        {"location": "body", "msg": "Invalid value", "path": "userId", "type": "field", "value": "asdfasdf"}
    ]
}

const resultValidationErrorNonRequiredField = {
    "errors": [
        {
            "type": "field",
            "value": 123,
            "msg": "Title must be a string",
            "path": "title",
            "location": "body"
        },
        {
            "type": "field",
            "value": 123,
            "msg": "Body must be a string",
            "path": "body",
            "location": "body"
        },
        {
            "type": "field",
            "value": "asdfasdf",
            "msg": "User ID must be an integer",
            "path": "userId",
            "location": "body"
        }
    ]
}



describe('Post Route', () => {

    afterAll((done) => {
        server.close(done);
    });

    describe('GET /posts route', () => {
        it('should return 200 status code', async () => {

            jest.spyOn(require('../libs/prisma').prisma.post, 'findMany').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .get('/posts?userId=1&title=Post 1&body=Body1')
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultSuccessful);
        });

        describe('should return 400 status code', () => {
            it('query string mismatch type for userId', async () => {
                const resultError  = {
                    "errors": [
                        {"location": "query", "msg": "User ID must be an integer", "path": "userId", "type": "field", "value": "aaaa"}
                    ]
                }

                const response = await request(server)
                    .get('/posts?userId=aaaa')
                    .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual(resultError);
            })
        });

        describe('should return 500 status code', () => {
            it('prisma query err ', async () => {

                jest.spyOn(require('../libs/prisma').prisma.post, 'findMany').mockRejectedValueOnce(
                    new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
                )

                const response = await request(server)
                    .get('/posts')
                    .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(response.body).toEqual(resultInternalServerError);
            })
        });
    })

    describe('GET /posts/{id} route', () => {
        it('should return 200 status code', async () => {

            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .get('/posts/1')
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultSuccessful);
        })

        it('should return 404 status code', async () => {

            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(null);

            const response = await request(server)
                .get('/posts/1')
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual(resultNotFound);
        })

        it('should return 400 status code', async () => {

            const resultError  = {
                "errors": [
                    {"location": "params", "msg": "Invalid value", "path": "id", "type": "field", "value": "asdf"}
                ]
            }

            const response = await request(server)
                .get('/posts/asdf')
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual(resultError);
        })

        it('should return 500 status code', async () => {

            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockRejectedValueOnce(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )

            const response = await request(server)
                .get('/posts/1')
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        })
    })

    describe('POST /posts route', () => {
        it('should return 201 status code', async () => {
            

            jest.spyOn(require('../libs/prisma').prisma.post, 'create').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .post('/posts')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.CREATED);
            expect(response.body).toEqual(resultSuccessful);

        })

        it('should return 400 status code', async () => {

            const response = await request(server)
                .post('/posts')
                .send({userId:'asdfasdf',title:123,body:123})
                .set('Authorization', `Bearer asdfsaadfasdfasdfasdf`);
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual(resultValidationErrorRequiredField);

        })

        it('should return 500 status code', async () => {

            jest.spyOn(require('../libs/prisma').prisma.post, 'create').mockRejectedValueOnce(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )

            const response = await request(server)
                .post('/posts')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfsdfasdfasfasdfasdf`);
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);

        })
    })

    describe('PUT /posts/{id} route', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(resultSuccessful);
            jest.spyOn(require('../libs/prisma').prisma.post, 'update').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .put('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultSuccessful);
        })

        it('should return 400 status code', async () => {

            const response = await request(server)
                .put('/posts/1')
                .send({userId:'asdfasdf',title:123,body:123})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual(resultValidationErrorRequiredField);
        })

        it('should return 404 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(null);

            const response = await request(server)
                .put('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual(resultNotFound);
        })

        it('should return 500 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockRejectedValueOnce(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )

            const response = await request(server)
                .put('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        })
    })

    describe('PATCH /posts/{id} route', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(resultSuccessful);
            jest.spyOn(require('../libs/prisma').prisma.post, 'update').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .patch('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual(resultSuccessful);
        })

        it('should return 400 status code', async () => {
                
                const response = await request(server)
                    .patch('/posts/1')
                    .send({userId:'asdfasdf',title:123,body:123})
                    .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body).toEqual(resultValidationErrorNonRequiredField);
        })

        it('should return 404 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(null);

            const response = await request(server)
                .patch('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual(resultNotFound);
        })

        it('should return 500 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockRejectedValueOnce(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )

            const response = await request(server)
                .patch('/posts/1')
                .send({userId:1,title:'Post 1',body:'Body 1'})
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        })
    })

    describe('DELETE /posts/{id} route', () => {
        it('should return 200 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(resultSuccessful);
            jest.spyOn(require('../libs/prisma').prisma.post, 'delete').mockResolvedValue(resultSuccessful);

            const response = await request(server)
                .delete('/posts/1')
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.OK);
            expect(response.body).toEqual({msg:'Post deleted'});
        })

        it('should return 404 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockResolvedValue(null);

            const response = await request(server)
                .delete('/posts/1')
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            expect(response.body).toEqual(resultNotFound);
        })

        it('should return 500 status code', async () => {
            jest.spyOn(require('../libs/prisma').prisma.post, 'findUnique').mockRejectedValueOnce(
                new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR)
            )

            const response = await request(server)
                .delete('/posts/1')
                .set('Authorization', `Bearer asasdfasdfasdfsadfasdfasdf`);
            expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual(resultInternalServerError);
        })
    })
});