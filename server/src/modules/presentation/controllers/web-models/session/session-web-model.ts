import { SessionState } from '../../../models/session.model';

export type SessionWebModel = {
    id: string,
    name: string,
    createdAt: Date,
    state: SessionState,
    currentSlideFeatureId: string,
};
