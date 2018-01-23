import { SupportStatus } from '../../../models/client-info.model';

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
