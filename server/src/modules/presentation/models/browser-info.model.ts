import { VersionInfo } from './version-info.model';

export type BrowserInfoModel = {
    system: VersionInfo,
    browser: VersionInfo
    navigator: Object,
    window: Object,
    userAgent: string,
    'Navigator.prototype': Object,
    'Window.prototype': Object,
    'ServiceWorker.prototype': Object,
    'ServiceWorkerRegistration.prototype': Object
};
