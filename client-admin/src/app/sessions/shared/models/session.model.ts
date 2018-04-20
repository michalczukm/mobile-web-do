import { Slide } from './slide.model';

export interface Session {
    id: string;
    name: string;
    createdAt: Date;
    state: SessionState;
    currentSlideFeatureId: string;
    availableSlides: Slide[];
    sessionUrl: string;
}

export enum SessionState {
    Welcome = 'WELCOME',
    Feature = 'FEATURE',
    Summary = 'SUMMARY',
    Closed = 'CLOSED'
}
