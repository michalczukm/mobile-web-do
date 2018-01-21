import { SessionState } from '../../models';

export class PresentationMessage {
    constructor(
        public readonly state: SessionState,
        public readonly session: { id: string, name: string },
        public readonly slideFeatureId?: string) {
    }
}
