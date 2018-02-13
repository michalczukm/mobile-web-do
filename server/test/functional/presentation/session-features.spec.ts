import 'mocha';
import { expect } from 'chai';
import * as Hapi from 'hapi';

import startServer from '../../../src/server'
import testConstants from '../tests.constants';

describe('session: set state', () => {
    let server: Hapi.Server;

    before(() => {
        server = new Hapi.Server();
        return startServer(server);
    });

    after(() => server.stop());

    it(`should set session feature for session in FEATURE state`, async () => {
        const actual = await server.inject({
            method: 'PUT',
            url: `/api/sessions/${testConstants.sessionIdFeatureState}/features/current`,
            payload: {
                slideFeatureId: 'device-RAM-memory'
            }
        });

        expect(actual.statusCode).to.equal(200);
    });

    it(`should set session current feature`, async () => {
        // arrange
        const sessionId = testConstants.sessionIdFeatureState;
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
            url: `/api/sessions/${testConstants.sessionIdWelcomeState}/features/current`,
            payload: {
                slideFeatureId: 'device-RAM-memory'
            }
        });

        expect(actual.statusCode).to.equal(400);
    });

    // todo, to be implemented. Now all sessions use same features set
    it('should return client 400 error when getting session features if session at given id not exists');

    it('should get session features', async () => {
        const actual = await server.inject({
            method: 'GET',
            url: `/api/sessions/${testConstants.sessionIdFeatureState}/features`
        });

        expect(actual.statusCode).to.equal(200);
    });
});
