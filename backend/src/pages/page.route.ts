import express from 'express'
import { getPages } from './page.controller'

export const router = express.Router()

router.get('/:pageTitle', [], getPages)

export default router
