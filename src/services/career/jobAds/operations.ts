import '@pn-server-only'
import { jobAdAuth } from './auth'
import { jobAdSchemas } from './schemas'
import { fetchActiveJobAds, fetchJobAd } from './client'
import { defineOperation } from '@/services/serviceOperation'

export const jobAdOperations = {
    read: defineOperation({
        paramsSchema: jobAdSchemas.read,
        authorizer: () => jobAdAuth.read.dynamicFields({}),
        operation: async ({ params }) => fetchJobAd(params.slug),
    }),
    readActive: defineOperation({
        authorizer: () => jobAdAuth.readActive.dynamicFields({}),
        operation: async () => fetchActiveJobAds(),
    }),
} as const
