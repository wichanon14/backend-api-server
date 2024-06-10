import { getClientConfig } from "../config/oidc.config"
import { getPort } from "../libs/port";

jest.mock('openid-client', () => {
    return {
        Issuer: {
            discover: jest.fn().mockResolvedValue({
                metadata:{
                    jwks_uri: 'jwks_uri',
                },
                Client: jest.fn().mockReturnValue({
                    authorizationUrl: jest.fn().mockReturnValue('http://localhost:3000/auth'),
                    callback: jest.fn().mockResolvedValueOnce({ token: 'token' }),
                    callbackParams: jest.fn().mockReturnValue({}),
                })
            })
        }
    }
})

describe('config', () => {
    describe('oidc', () => {
        it('oidc config should be defined', async () => {
            const client = getClientConfig();
            expect(client).toBeDefined();
        })
    })

    describe('getPort', () => {
        afterEach(() => {
            delete process.env.PORT;
        })

        it('should return 5000', () => {
            process.env.PORT = '5000';
            const port = getPort();
            expect(port).toBe('5000');
        })

        it('should return 3000', () => {
            const port = getPort();
            expect(port).toBe(3000);
        })
    })
})