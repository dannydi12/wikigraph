import express from 'express'
import { getDeepLinks, getLinks } from './link.controller'
import { cacheResponse } from '../utils/middleware'

export const router = express.Router()

router.get('/deep/:pageTitleId', [cacheResponse], getDeepLinks)
router.get('/:pageTitleId', [cacheResponse], getLinks)

export default router
