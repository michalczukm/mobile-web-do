import { FeatureDto } from './feature.dto';

// fixed list of presentation features - not async.
function getPresentationSet(): FeatureDto[] {
    return [
        { id: 'home-screen', name: 'Home Screen' },
        { id: 'push-notifications', name: 'Push Notifications' },
        { id: 'device-orientation', name: 'Device Orientation' },
        { id: 'network-type-speed', name: 'Network type & speed' },
        { id: 'bluetooth', name: 'Bluetooth' },
        { id: 'online-state', name: 'Online State' },
        { id: 'device-RAM-memory', name: 'Device RAM' },
        { id: 'ambient-light', name: 'Ambient Light' },
        { id: 'battery-status', name: 'Battery Status' },
        { id: 'vibration', name: 'Vibration' },
        { id: 'geolocation', name: 'Geolocation' },
        { id: 'device-position', name: 'Device position' },
        { id: 'storage-quota', name: 'Storage Quota' },
        { id: 'gyroscope', name: 'Gyroscope' },
        { id: 'accelerometer', name: 'Accelerometer' },
        { id: 'device-motion', name: 'Device Motion' },
        { id: 'speech-recognition', name: 'Speech Recognition' },
        { id: 'usb', name: 'Web USB' }
    ];
}

export default {
    getPresentationSet
};
