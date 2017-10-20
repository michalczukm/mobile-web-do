export class Feature {
    constructor(id, ...tests) {
        this.id = id;
        this.tests = tests;
    }

    examine() {
        return TestResult.from(this.tests);
    }
}

export class TestResult {
    failed = { tests: [] };
    passed = { tests: [] };

    get isSuccess() {
        return this.passed.tests.length > 0;
    }

    get isFailure() {
        return !this.isSuccess;
    }

    constructor(passed, failed) {
        this.passed = passed;
        this.failed = failed;
    }

    static from(tests) {
        const passed = [];
        const failed = [];

        tests.forEach(test => {
            try {
                test()
                    ? passed.push(test)
                    : failed.push(test);
            } catch (ex) {
                failed.push(test);
            }
        });

        return new TestResult(passed, failed);
    }
}
