'use server'
import { jobAdOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readJobAdAction = makeAction(jobAdOperations.read)
export const readActiveJobAdsAction = makeAction(jobAdOperations.readActive)
