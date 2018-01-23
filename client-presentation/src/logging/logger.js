class ConsoleLogger {
    error(message, error) {
        console.error('=== ERROR ===', message, error);
    }

    info(message, payload) {
        console.log('===', message, payload);
    }

    debug(message, payload) {
        console.log('=== DEBUG ===', message, payload);
    }
}

export const logger = new ConsoleLogger();
