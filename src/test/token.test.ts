import { HttpStatus } from '../libs/error';
import { server } from '../server';
import request from 'supertest';
import jwksClient from "jwks-rsa"

jest.mock('openid-client', () => {
    return {
        Issuer: {
            discover: jest.fn().mockResolvedValue({
                metadata:{
                    jwks_uri: 'jwks_uri',
                }
            })
        }
    }
})

jest.mock('jsonwebtoken', () => {
    return {
        decode: jest.fn().mockReturnValue({
            header: { kid: 'kid' }
        }),
        verify: jest.fn()
    }
})

jest.mock('jwks-rsa',()=>{
    return jest.fn().mockReturnValue({
        getSigningKey: jest.fn().mockResolvedValue({
            getPublicKey: jest.fn().mockResolvedValueOnce('key')
        })
    })
})

jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                $connect: jest.fn().mockResolvedValue({}),
                post: {
                    findMany: jest.fn(),
                    findUnique: jest.fn().mockResolvedValue({}),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn()
                },
                $disconnect: jest.fn()
            }
        })
    }
})

describe('Token validation middleware', () => {
    
    afterAll(() => {
        server.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('GET /posts/:id', () => {
        it('should return 200', async () => {
            
            const response = await request(server)
                .get('/posts/1')
                .set('Authorization', 'Bearer XXX');
            expect(response.status).toBe(HttpStatus.OK);
        })


        describe('should return 401', () => {
            it('when token is missing', async () => {
                const response = await request(server).get('/posts/1');
                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            })

            it('when token is in the wrong format', async () => {
                const response = await request(server).get('/posts/1').set('Authorization', 'Basic XXX');
                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            });

            it('when token\'s header does not contain kid', async () => {
                jest.spyOn(require('jsonwebtoken'), 'decode').mockReturnValueOnce(null);
                const response = await request(server)
                .get('/posts/1')
                .set('Authorization', 'Bearer XXX');
                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            })

            it('when can not get public key', async () => {
                const response = await request(server)
                .get('/posts/1')
                .set('Authorization', 'Bearer XXX');
                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            })

            it('when jwt verify is error', async () => {
                jest.spyOn(require('jsonwebtoken'), 'decode').mockReturnValueOnce({
                    header: { kid: 'kid' }
                });
                jest.spyOn(require('jwks-rsa')(), 'getSigningKey').mockResolvedValueOnce({
                    getPublicKey: jest.fn().mockResolvedValueOnce('key')
                })
                jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementationOnce(()=>{
                    throw new Error('jwt verify error');
                })
                const response = await request(server)
                .get('/posts/1')
                .set('Authorization', 'Bearer XXX');
                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            })
        });
    })

})