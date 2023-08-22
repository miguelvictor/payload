import type { TFunction } from 'i18next';
import APIError from './APIError';
declare class QueryError extends APIError<{
    path: string;
}[]> {
    constructor(results: {
        path: string;
    }[], t?: TFunction);
}
export default QueryError;
