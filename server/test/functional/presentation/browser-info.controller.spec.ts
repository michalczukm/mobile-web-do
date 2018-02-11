import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';

describe('browser info', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    it('should add browser info for correct data', () => {
        return server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionId,
                browserInfo: {
                    navigator: {},
                    window: {}
                }
            }
        }).then(response => {
            expect(response.statusCode).to.equal(200);
        });
    });

    it('should return client 404 error for non existing session', () => {
        const nonExistingSessionId = '123123123';
        return server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: nonExistingSessionId,
                browserInfo: {
                    navigator: {},
                    window: {}
                }
            }
        }).then(response => {
            expect(response.statusCode).to.equal(404);
        });
    });

    it('should return client 400 error for non browser info without sessionId', () => {
        return server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                browserInfo: {
                    window: {},
                    navigator: {}
                }
            }
        }).then(response => {
            expect(response.statusCode).to.equal(400);
        });
    });

    it('should return client 400 error for non browser info without navigator', () => {
        return server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionId,
                browserInfo: {
                    window: {}
                }
            }
        }).then(response => {
            expect(response.statusCode).to.equal(400);
        });
    });

    it('should return client 400 error for non browser info without window', () => {
        return server.inject({
            method: 'POST',
            url: '/api/browser-info',
            payload: {
                sessionId: testConstants.sessionId,
                browserInfo: {
                    navigator: {}
                }
            }
        }).then(response => {
            expect(response.statusCode).to.equal(400);
        });
    });

    after(() => server.stop());
});
