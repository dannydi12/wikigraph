import { Router } from 'express'
import pages from './pages/page.route'
import links from './links/link.route'

const rootRouter = Router()
rootRouter.use('/pages', pages)
rootRouter.use('/links', links)

export default rootRouter
