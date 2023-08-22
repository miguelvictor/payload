import { Config as GeneratedTypes } from 'payload/generated-types';
import { Document, Where } from '../../../types';
import type { PaginatedDocs } from '../../../database/types';
import { Payload } from '../../../payload';
import { TypeWithVersion } from '../../../versions/types';
export type Options<T extends keyof GeneratedTypes['globals']> = {
    slug: T;
    depth?: number;
    page?: number;
    limit?: number;
    locale?: string;
    fallbackLocale?: string;
    user?: Document;
    overrideAccess?: boolean;
    showHiddenFields?: boolean;
    sort?: string;
    where?: Where;
};
export default function findVersionsLocal<T extends keyof GeneratedTypes['globals']>(payload: Payload, options: Options<T>): Promise<PaginatedDocs<TypeWithVersion<GeneratedTypes['globals'][T]>>>;
