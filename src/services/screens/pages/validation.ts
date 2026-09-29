import { ValidationBase } from '@/services/Validation'
import { ScreenPageType } from '@/prisma-generated-pn-types'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const basePageValidation = new ValidationBase({
    type: {
        name: z.string(),
        type: z.nativeEnum(ScreenPageType)
    },
    details: {
        name: z.string(),
        type: z.nativeEnum(ScreenPageType)
    }
})

export const createPageValidation = basePageValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreatePageTypes = ValidationTypes<typeof createPageValidation>

export const updatePageValidation = basePageValidation.createValidationPartial({
    keys: ['name', 'type'],
    transformer: data => data
})
export type UpdatePageTypes = ValidationTypes<typeof updatePageValidation>
