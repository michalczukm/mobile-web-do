import { supportStatus } from './support-status';
import { logger } from '../logging';

const statusFor = testsResult => {
    if (testsResult.isFailure) {
        return supportStatus.NO_SUPPORT;
    } else if (
        testsResult.isSuccess &&
        testsResult.passed.some(test => test.specification === specificationType.STANDARD)
    ) {
        return supportStatus.STANDARD;
    } else if (
        testsResult.isSuccess &&
        testsResult.passed.some(test => test.specification === specificationType.VENDOR)
    ) {
        return supportStatus.VENDOR_SPECIFIC;
    } else {
        logger.error(`Unhandled test result state for results: ${JSON.stringify(testsResult)}`);
        throw new Error('Unhandled test result state');
    }
};

export const specificationType = {
    OLD: 'OLD',
    STANDARD: 'STANDARD',
    VENDOR: 'VENDOR',
};

export class Feature {
    constructor(id, exampleUsage, runInClientFn, ...tests) {
        this.id = id;

        this.exampleUsage = exampleUsage;
        this.tests = tests;
        this.testsResult = TestResult.from(this.tests);
        this.status = statusFor(this.testsResult);
        this.runInClientFn = () => {
            try {
                return runInClientFn();
            } catch (ex) {
                logger.error(
                    `Failed with running 'runInClientFn' for '${this.id}' feature. Error: ${ex}`,
                );
                return {};
            }
        };
    }
}

export class TestResult {
    get isSuccess() {
        return this.passed.length > 0;
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
                test.test() ? passed.push(test) : failed.push(test);
            } catch (ex) {
                failed.push(test);
            }
        });

        return new TestResult(passed, failed);
    }
}
