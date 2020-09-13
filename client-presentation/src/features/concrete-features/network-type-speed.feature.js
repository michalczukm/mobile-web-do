import { Feature, specificationType } from '../feature';

const exampleUsage = `
// get current
const connection = navigator.connection;

// subscribe for event
navigator.connection.addEventListener('change', e => {
    ...
});

// by W3C draft:
enum ConnectionType {
    "bluetooth",
    "cellular",
    "ethernet",
    "mixed",
    "none",
    "other",
    "unknown",
    "wifi",
    "wimax"
};

enum EffectiveConnectionType {
    "2g",
    "3g",
    "4g",
    "slow-2g"
};

// The downlinkMax attribute represents an upper bound on the downlink speed of the first network hop. The reported value is in megabits per second
`;

export default new Feature(
    'network-type-speed',
    exampleUsage,
    () => {
        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection ||
            navigator.msConnection;
        return {
            infoArray: [
                `Your connection type: ${connection.type}`,
                `Your connection effective type: ${connection.effectiveType}`,
                `Your RTT: ${connection.rtt}`,
                `Your downlink: ${connection.downlink}`,
                `Your downlinkMax: ${connection.downlinkMax}`,
            ],
        };
    },
    { test: () => navigator.connection, specification: specificationType.STANDARD },
    { test: () => navigator.mozConnection, specification: specificationType.VENDOR },
    { test: () => navigator.webkitConnection, specification: specificationType.VENDOR },
    { test: () => navigator.msConnection, specification: specificationType.VENDOR },
);
