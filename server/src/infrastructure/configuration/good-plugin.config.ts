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
            module: 'good-console'
        }, 'stdout'],
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
            module: 'good-console'
        }, 'stdout']
    }
};
