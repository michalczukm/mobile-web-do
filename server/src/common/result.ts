export class Result {
    public get isFail(): boolean {
        return !this.isSuccess
    };

    static success(): Result {
        return new Result(true);
    }

    static fail(errors: string[]): Result {
        return new Result(false, errors);
    }

    get errorsMessage(): string {
        return this.errors.join((','));
    }

    private constructor(
        public isSuccess: boolean,
        public errors = [] as string[]) {
    }
}
