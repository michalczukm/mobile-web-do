import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import seedConstants from '../../../src/infrastructure/db-seeds/seed.constants';
import { integrationTestsSetupBuilder, TestsSetup } from '../functional-tests-utils';

describe('session: set state', function(): void {
    this.timeout(10000);
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

    ['WELCOME', 'FEATURE', 'SUMMARY', 'CLOSED'].forEach(state => {
        it(`should set new session "${state}" state`, async () => {
            // arrange
            const sessionId = seedConstants.sessionIdFeatureState;
            const callGetSessionState = () => server.inject({
                method: 'GET',
                url: `/api/sessions/${sessionId}`,
            }).then(response => (response.result as any).state);
            const expected = state;

            // act
            await server.inject({
                method: 'PUT',
                url: `/api/sessions/${sessionId}/state`,
                payload: {
                    state: state
                }
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
            url: `/api/sessions/${nonExistingSessionId}/state`
        });

        expect(actual.statusCode).to.equal(400);
    });
});
