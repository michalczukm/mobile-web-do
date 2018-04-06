export const logger = new class ConsoleLogger {
    error(message, error): void {
        console.error('=== ERROR ===', message, error);
    }

    info(message, payload): void {
        console.log('===', message, payload);
    }

    debug(message, payload): void {
        console.log('=== DEBUG ===', message, payload);
    }
};
