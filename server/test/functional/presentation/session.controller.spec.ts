import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'

describe('session', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    it('should get sesions', () => {
        return server.inject({
            method: 'GET',
            url: '/api/sessions'
        }).then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.result).to.have.length(3);
        });
    });

    after(() => server.stop());
});
