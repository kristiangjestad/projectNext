import { RequireNothing } from '@/auth/authorizer/RequireNothing'

export const jobAdAuth = {
    read: RequireNothing.staticFields({}),
    readActive: RequireNothing.staticFields({}),
} as const
