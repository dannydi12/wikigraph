import express from 'express'
import { getPages } from './page.controller'

export const router = express.Router()

router.get('/:pageTitleId', [], getPages)

export default router