import { Result } from '../../../common';
import { sessionRepository } from '../data-access';

export const sessionExists = async (sessionId: string): Promise<Result> => {
    if (await sessionRepository.exists(sessionId)) {
        return Result.success();
    } else {
        const message = `Session ${sessionId} not found`;
        return Result.fail([message]);
    }
};
