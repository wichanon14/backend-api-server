import request from 'supertest'
import { server } from '../server'
describe('Health Route', () => {
    afterAll(() => {
        server.close()
    })
    it('should return 200', async () => {
        const response = await request(server).get('/')
        expect(response.status).toBe(200)
    })
})