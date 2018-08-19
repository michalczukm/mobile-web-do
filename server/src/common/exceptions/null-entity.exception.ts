export class NullEntityError extends Error {
    constructor(message?: string) {
        super(message);

        this.name = 'Null Entity in data access layer';
    }
}
