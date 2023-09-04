import { Router } from 'express'
import pages from './pages/page.route'

const rootRouter = Router()
rootRouter.use('/pages', pages)

export default rootRouter
