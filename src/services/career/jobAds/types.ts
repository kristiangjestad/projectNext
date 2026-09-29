import type { z } from 'zod'
import type { contactorJobSchema, contactorJobDetailSchema } from './schemas'

export type SimpleJobAd = z.infer<typeof contactorJobSchema>
export type ExpandedJobAd = z.infer<typeof contactorJobDetailSchema>
