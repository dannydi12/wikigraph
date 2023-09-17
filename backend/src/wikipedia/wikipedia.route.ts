import express from 'express'
import { searchWikipedia } from './wikipedia.controller'
import { cacheResponse } from '../utils/middleware'

export const router = express.Router()

router.get('/', [cacheResponse], searchWikipedia)

export default router
