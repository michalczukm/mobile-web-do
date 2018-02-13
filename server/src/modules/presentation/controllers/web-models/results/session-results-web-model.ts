import { SupportStatus } from '../../../../../common';

export type SystemStatisticWebMode = {
    quantity: number,
    family: string
}

export type SessionResultsWebModel = {
    clientsQuantity: number,
    systems: SystemStatisticWebMode[],
    browsers: SystemStatisticWebMode[],
    results: {
        featureId: string,
        statuses: SupportStatus[]
    }[]
};
