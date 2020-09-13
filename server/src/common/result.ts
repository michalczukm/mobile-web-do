export class Result {
  static fail(errors: string[]): Result {
    return new Result(false, errors);
  }

  static success(): Result {
    return new Result(true);
  }

  public get isFail(): boolean {
    return !this.isSuccess;
  }

  get errorsMessage(): string {
    return this.errors.join(',');
  }

  private constructor(
    public isSuccess: boolean,
    public errors = [] as string[]
  ) {}
}
