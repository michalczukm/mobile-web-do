export default {
    includes: {
        request: ['headers'],
        response: ['headers']
    },
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ response: '*'}]
        }, {
            module: 'good-console'
        }, 'stdout'],
        webServerFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ request: { include: ['presentation']}, response: { include: ['presentation']} }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson',
            args: [
                null,
                { separator: ',' }
            ]
        }, {
            module: 'rotating-file-stream',
            args: [
                'webserver',
                {
                    size: '100MB',
                    path: './log/web'
                }
            ]
        }],
        logsFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*'}]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson',
            args: [
                null,
                { separator: ',' }
            ]
        }, {
            module: 'rotating-file-stream',
            args: [
                'logs',
                {
                    size: '100MB',
                    path: './log/logs'
                }
            ]
        }]
    }
};
