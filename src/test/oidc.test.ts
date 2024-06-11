import { HttpStatus } from '../libs/error'
import { server } from '../server'
import request from 'supertest'

jest.mock('openid-client', () => {
    return {
        generators: {
            codeVerifier: jest.fn().mockReturnValue('codeVerifier'),
            codeChallenge: jest.fn().mockReturnValue('codeChallenge'),
            nonce: jest.fn().mockReturnValue('nonce')
        },
        Issuer: {
            discover: jest.fn().mockResolvedValue({
                Client: jest.fn().mockReturnValue({
                    authorizationUrl: jest.fn().mockReturnValue('http://localhost:3000/auth'),
                    callback: jest.fn().mockResolvedValueOnce({ token: 'token' }),
                    callbackParams: jest.fn().mockReturnValue({}),
                })
            })
        }
    }
})


jest.mock('../config/oidc.config', () => {
    return {
        getClientConfig: jest.fn().mockResolvedValue({
            authorizationUrl: jest.fn().mockReturnValue('http://localhost:3000/auth'),
            callback: jest.fn().mockResolvedValue({ token: 'token' }),
            callbackParams: jest.fn().mockReturnValue({}),
            issuer:{
                metadata:{
                    end_session_endpoint: 'http://localhost:3000'
                }
            }
        })
    }
})

jest.mock('jsonwebtoken', () => {
    return {
        decode: jest.fn().mockReturnValue({
            payload:{ nonce: 'nonce' }
        })
    }
})

jest.mock('../libs/validateToken', () => {
    return {
        validateToken: jest.fn().mockReturnValue(true)
    }
})

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


describe('OIDC Route', () => {
    afterAll(() => {
        server.close()
    })

    describe('GET /auth', () => {
        it('should return 302', async () => {
            const response = await request(server).get('/auth')
            expect(response.status).toBe(HttpStatus.REDIRECT)
            expect(response.header.location).toBe('http://localhost:3000/auth')
        })
    })

    describe('POST /callback', () => {
        it('should return 200', async () => {
            const response = await request(server)
                .post('/callback')
                .send({ id_token: 'id_token' })
            expect(response.status).toBe(HttpStatus.OK)
        })

        describe('should return 400', () => {
            it('when id_token is invalid and undecodable', async () => {
                jest.spyOn(require('jsonwebtoken'), 'decode').mockReturnValueOnce(null)
                const response = await request(server)
                    .post('/callback')
                    .send({ id_token: 'invalid_id_token' })
                expect(response.status).toBe(HttpStatus.BAD_REQUEST)
            })
            it('when id_token is invalid and missing nonce', async () => {
                jest.spyOn(require('jsonwebtoken'), 'decode').mockReturnValueOnce({
                    payload: {}
                })
                const response = await request(server)
                    .post('/callback')
                    .send({ id_token: 'invalid_id_token' })
                expect(response.status).toBe(HttpStatus.BAD_REQUEST)
            })
        })

        describe('should return 500', () => {
            it('when clinet callback failed', async () => {
                const client = await require('../config/oidc.config').getClientConfig()
                jest.spyOn(client, 'callback').mockResolvedValueOnce(null)
                const response = await request(server)
                    .post('/callback')
                    .send({ id_token: 'id_token' })
                expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
            })
        })
    })

    describe('GET /logout', () => {
        it('should return 302', async () => {
            const response = await request(server).get('/logout')
            expect(response.status).toBe(HttpStatus.REDIRECT)
        })

        it('should return 302', async () => {
            const client = require('../config/oidc.config')
            jest.spyOn(client, 'getClientConfig').mockResolvedValueOnce({
                issuer:{
                    metadata:{
                        end_session_endpoint: null
                    }
                }
            })
            const response = await request(server).get('/logout')
            expect(response.status).toBe(HttpStatus.REDIRECT)
        })
    })
})