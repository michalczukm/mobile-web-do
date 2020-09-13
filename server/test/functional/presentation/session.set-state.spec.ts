import 'mocha';
import { expect } from 'chai';
import * as Hapi from '@hapi/hapi';

import setupServer from '../../../src/server'
import { seedConstants } from '../../../src/infrastructure/db-seeds/seed.constants';
import { getAuthWithAdminCredentials, integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('session: set state', function(): void {
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

    ['WELCOME', 'FEATURE', 'SUMMARY', 'CLOSED'].forEach(state => {
        it(`should set new session "${state}" state`, async () => {
            // arrange
            const sessionId = seedConstants.sessionIdFeatureState;
            const callGetSessionState = () => server.inject({
                method: 'GET',
                url: `/api/sessions/${sessionId}`,
                ...getAuthWithAdminCredentials()
            }).then(response => (response.result as any).state);
            const expected = state;

            // act
            await server.inject({
                method: 'PUT',
                url: `/api/sessions/${sessionId}/state`,
                payload: {
                    state: state
                },
                ...getAuthWithAdminCredentials()
            });

            // assert
            const actualSessionState = await callGetSessionState();
            expect(actualSessionState).to.equal(expected);
        });
    });

    it('should return client 400 error for non existing session', async () => {
        const nonExistingSessionId = '123123123';

        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${nonExistingSessionId}/state`,
            ...getAuthWithAdminCredentials()
        });

        expect(actual.statusCode).to.equal(400);
    });
});
