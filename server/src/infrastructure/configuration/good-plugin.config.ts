export default {
  includes: {
    request: ['headers'],
    response: ['headers'],
  },
  reporters: {
    console: [
      {
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [{ response: '*' }],
      },
      {
        module: '@hapi/good-console',
      },
      'stdout',
    ],
    webServerFileReporter: [
      {
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [
          {
            request: { include: ['presentation'] },
            response: { include: ['presentation'] },
          },
        ],
      },
      {
        module: '@hapi/good-console',
      },
      'stdout',
    ],
    logsFileReporter: [
      {
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*' }],
      },
      {
        module: '@hapi/good-console',
      },
      'stdout',
    ],
  },
};
