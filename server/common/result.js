module.exports = class Result {
    constructor(isSuccess, errors) {
        this.isSuccess = isSuccess;
        this.isFail = !isSuccess;
        this.errors = errors || [];
    }

    static success() {
        return new Result(true);
    }

    static fail(errors) {
        return new Result(false, errors);
    }
}