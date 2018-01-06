class ConsoleLogger {
    error(message, error) {
        console.error('=== ERROR === ', message, error);
    }

    info (message) {
        console.log('=== ', message);
    }

    debug(message, payload) {
        console.debug('=== DEBUG ===', message, payload);
    }
}

export default new ConsoleLogger();
