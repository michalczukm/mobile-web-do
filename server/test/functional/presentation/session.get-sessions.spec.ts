import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('session: get sessions', () => {
    let server: Hapi.Server;
    let testSetup: TestsSetup;

    before(async () => {
        testSetup = integrationTestsSetupBuilder.withStandardSetup();
        server = new Hapi.Server();
        await startServer(server).then(testSetup.setup);
    });

    after(async () => {
        try {
            await testSetup.tearDown();
        } finally {
            server.stop();
        }
    });

    it('should get all sesions', async () => {
        const actual = await server.inject({
            method: 'GET',
            url: '/api/sessions'
        });

        expect(actual.statusCode).to.equal(200);
        expect(actual.result).to.have.length.greaterThan(1);
    });

    it('should get single session', async () => {
        const actual = await server.inject({
            method: 'GET',
            url: `/api/sessions/${testConstants.sessionIdFeatureState}`
        });

        expect(actual.statusCode).to.equal(200);
    });
});
