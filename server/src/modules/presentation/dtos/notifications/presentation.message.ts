import { SessionState } from '../../../../common';

export class PresentationMessage {
    constructor(
        public readonly state: SessionState,
        public readonly session: { id: string, name: string },
        public readonly slideFeatureId?: string) {
    }
}
