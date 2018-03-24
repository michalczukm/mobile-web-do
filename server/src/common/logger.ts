class ConsoleLogger {
    error(message: string, error: string | Object): void {
        console.error('=== ERROR ===', message, error);
    }

    info(message: string, payload?: string | Object): void {
        console.log('===', message, payload);
    }

    debug(message: string, payload: string | Object): void {
        console.log('=== DEBUG ===', message, payload);
    }
}

export const logger = new ConsoleLogger();
