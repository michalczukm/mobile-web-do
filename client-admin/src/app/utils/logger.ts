export const logger = new class ConsoleLogger {
    error(message: string, error?: Error | Partial<Error>): void {
        console.error('=== ERROR ===', message, error);
    }

    info(message: string, payload?: object): void {
        console.log('===', message, payload);
    }

    debug(message: string, payload?: object): void {
        console.log('=== DEBUG ===', message, payload);
    }
};
