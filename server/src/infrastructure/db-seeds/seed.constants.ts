import { SessionState } from '../../common/enums/session-state';
import { SessionModel } from '../../modules/presentation/models';

export const seedConstants = {
  sessionIdFeatureState: '5ab6f4000210b1df5d4f70c1',
  sessionIdWelcomeState: '5ab6f40019089dda5260217a',
};

export const SEED_DATA: SessionModel[] = [
  {
    id: seedConstants.sessionIdFeatureState,
    name: 'running test session',
    createdAt: new Date(),
    clientIdentifiers: [],
    browserInfo: [],
    state: SessionState.Feature,
    currentSlideFeatureId: 'home-screen',
    clientResults: [],
  },
  {
    id: seedConstants.sessionIdWelcomeState,
    name: 'not opened test session',
    clientIdentifiers: [],
    createdAt: new Date(),
    browserInfo: [],
    state: SessionState.Welcome,
    clientResults: [],
    currentSlideFeatureId: '',
  },
  {
    id: '5ab6f400ae92cba4516d534c',
    name: 'company specific session',
    clientIdentifiers: [],
    createdAt: new Date(),
    browserInfo: [],
    state: SessionState.Welcome,
    clientResults: [],
    currentSlideFeatureId: '',
  },
];
