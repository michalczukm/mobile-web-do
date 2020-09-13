import * as Hapi from '@hapi/hapi';

type LogLevel = 'info' | 'debug' | 'error' | 'fatal';

class ConsoleLogger {
    private serverInstance!: Hapi.Server | null;

    setupServerLogging(serverInstatnce: Hapi.Server): void {
        this.serverInstance = serverInstatnce;
    }

    error(message: string, error: string | Object): void {
        this.log('error', '=== ERROR ===', message, error)
    }

    info(message: string, payload?: string | Object): void {
        this.log('info', '===', message, payload)
    }

    debug(message: string, payload: string | Object): void {
        this.log('debug', '=== DEBUG ===', message, payload)
    }

    fatal(message: string, error: string | Object): void {
        this.log('error', '=== FATAL ===', message, error);
    }

    private log(logLevel: LogLevel, displayAppendix: string, message: string, payload?: string | Object): void {
        const consoleLog = () => (['error', 'fatal'].includes(logLevel) ? console.error : console.log)(displayAppendix, message, payload);

        this.serverInstance
            ? this.serverInstance.log(logLevel, [message, payload])
            : consoleLog()
    }
}

export const logger = new ConsoleLogger();
