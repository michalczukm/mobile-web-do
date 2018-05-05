import { Feature, specificationType } from '../feature';

export default new Feature('device-RAM-memory',
    `// get current device memory. Estimated
const memory = navigator.deviceMemory;
`,
    () => ({
        infoArray: [`Your device has ~${navigator.deviceMemory} GB`]
    }), {
        test: () => navigator.deviceMemory,
        specification: specificationType.STANDARD
    }
);
