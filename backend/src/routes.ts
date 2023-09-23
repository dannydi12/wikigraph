import { Router } from 'express'
import links from './links/link.route'
import wikipedia from './wikipedia/wikipedia.route'

const rootRouter = Router()
rootRouter.use('/links', links)
rootRouter.use('/wikipedia', wikipedia)

export default rootRouter
