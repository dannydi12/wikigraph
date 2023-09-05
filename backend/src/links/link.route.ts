import express from 'express'
import { getDeepLinks, getLinks } from './link.controller'

export const router = express.Router()

router.get('/deep/:pageTitleId', [], getDeepLinks)
router.get('/:pageTitleId', [], getLinks)

export default router
