import { FeatureDto } from './feature.dto';

// fixed list of presentation features - not async.
function getPresentationSet(): FeatureDto[] {
    return [
        { id: 'home-screen', name: 'Home Screen' },
        { id: 'push-notifications', name: 'Push Notifications' },
        { id: 'device-orientation', name: 'Device Orientation' }
    ]
};

export default {
    getPresentationSet
};
