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

    it(`should set session feature for session in FEATURE state`, async () => {
        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${seedConstants.sessionIdFeatureState}/features/current`,
            payload: {
                slideFeatureId: 'device-RAM-memory'
            }
        });

        expect(actual.statusCode).to.equal(200);
    });

    it(`should set session current feature`, async () => {
        // arrange
        const sessionId = seedConstants.sessionIdFeatureState;
        const featureId = 'device-RAM-memory';

        const callGetCurrentSessionFeature = () => server.inject({
            method: 'GET',
            url: `/api/sessions/${sessionId}`
        }).then(response => (response.result as any).currentSlideFeatureId);

        // act
        await server.inject({
            method: 'PUT',
            url: `/api/sessions/${sessionId}/features/current`,
            payload: {
                slideFeatureId: featureId
            }
        });

        // assert
        const actualSessionFeature = await callGetCurrentSessionFeature();
        expect(actualSessionFeature).to.equal(featureId);
    });

    it(`should return 400 client error when session at given id not existing`, async () => {
        const nonExistingSessionId = '123123123';

        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${nonExistingSessionId}}/features/current`,
            payload: {
                slideFeatureId: 'device-RAM-memory'
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    it(`should return 400 client error when session is not in FEATURE state`, async () => {
        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${seedConstants.sessionIdWelcomeState}/features/current`,
            payload: {
                slideFeatureId: 'device-RAM-memory'
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    it('should return client 404 error when getting session features if session at given id not exists', async () => {
        const nonExistingSessionId = '123123123';

        const actual = await
            server.inject({
                method: 'GET',
                url: `/api/sessions/${nonExistingSessionId}/features`
            });

        expect(actual.statusCode).to.equal(404);
    });

    it('should get session features', async () => {
        const actual = await server.inject({
            method: 'GET',
            url: `/api/sessions/${seedConstants.sessionIdFeatureState}/features`
        });

        expect(actual.statusCode).to.equal(200);
    });
});
