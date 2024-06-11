import request from 'supertest'
import { server } from '../server'


jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                $connect: jest.fn().mockResolvedValue({}),
                $disconnect: jest.fn()
            }
        })
    }
})

describe('Health Route', () => {
    afterAll(() => {
        server.close()
    })
    it('should return 200', async () => {
        const response = await request(server).get('/')
        expect(response.status).toBe(200)
    })
})