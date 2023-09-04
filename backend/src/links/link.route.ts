import express from 'express'
import { getLinks } from './link.controller'

export const router = express.Router()

router.get('/:pageTitleId', [], getLinks)

export default router
