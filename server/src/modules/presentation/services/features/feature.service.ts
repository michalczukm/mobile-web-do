import { FeatureDto } from './feature.dto';

// fixed list of presentation features - not async.
const FEATURES = [
        { id: 'home-screen', name: 'Home Screen' },
        { id: 'push-api', name: 'Push API' },
        { id: 'notifications-api', name: 'Notifications API' },
        { id: 'screen-orientation', name: 'Screen Orientation' },
        { id: 'network-type-speed', name: 'Network type & speed' },
        { id: 'bluetooth', name: 'Bluetooth' },
        { id: 'online-state', name: 'Online State' },
        { id: 'device-RAM-memory', name: 'Device RAM' },
        { id: 'device-motion', name: 'Device Motion' },
        { id: 'device-orientation', name: 'Device Orientation' },
        { id: 'ambient-light', name: 'Ambient Light' },
        { id: 'battery-status', name: 'Battery Status' },
        { id: 'vibration', name: 'Vibration' },
        { id: 'geolocation', name: 'Geolocation' },
        { id: 'storage', name: 'Storage' },
        { id: 'storage-quota', name: 'Storage Quota' },
        { id: 'gyroscope', name: 'Gyroscope' },
        { id: 'accelerometer', name: 'Accelerometer' },
        { id: 'relative-orientation-sensor', name: 'Relative Orientation Sensor' },
        { id: 'speech-recognition', name: 'Speech Recognition' },
        { id: 'share', name: 'Share media' },
        { id: 'usb', name: 'Web USB' },
        { id: 'nfc', name: 'NFC' },
        { id: 'camera', name: 'Camera' },
        { id: 'gamepad-api', name: 'Gamepad API' }
    ];

function getPresentationSet(): FeatureDto[] {
    return FEATURES;
}

function getFirstFeature(): FeatureDto {
    return FEATURES[0];
}

export default {
    getPresentationSet,
    getFirstFeature
};
