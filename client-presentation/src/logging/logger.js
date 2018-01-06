class ConsoleLogger {
    error(message, error) {
        console.error('=== ERROR ===', message, error);
    }

    info (message) {
        console.log('===', message);
    }

    debug(message, payload) {
        console.log('=== DEBUG ===', message, payload);
    }
}

export const logger = new ConsoleLogger();
