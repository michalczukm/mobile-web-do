import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import setupServer from '../../../src/server'
import seedConstants from '../../../src/infrastructure/db-seeds/seed.constants';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('session: get sessions', function (): void {
    let server: Hapi.Server;

    const testSetup: TestsSetup = integrationTestsSetupBuilder.withStandardSetup();
    before(async () => {
        server = await setupServer();
        await testSetup.setup();
        await server.start();
    });

    after(async () => {
        try {
            await testSetup.tearDown();
        } finally {
            await server.stop();
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
            url: `/api/sessions/${seedConstants.sessionIdFeatureState}`
        });

        expect(actual.statusCode).to.equal(200);
    });
});
