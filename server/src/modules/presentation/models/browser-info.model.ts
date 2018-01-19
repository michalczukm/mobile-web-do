export type BrowserInfo = {
    systemVersion: VersionInfo,
    browserVersion: VersionInfo
    navigator: Object,
    window: Object,
    userAgent: string,
    'Navigator.prototype': Object,
    'Window.prototype': Object,
    'ServiceWorker.prototype': Object,
    'ServiceWorkerRegistration.prototype': Object
};

export type VersionInfo = {
    family: string,
    versionString: string,
    version: {
        major: string,
        minor: string,
        patch: string
    }
};
