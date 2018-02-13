import { SessionState } from '../../../../../common';

export type SessionWebModel = {
    id: string,
    name: string,
    createdAt: Date,
    state: SessionState,
    currentSlideFeatureId: string,
};
