import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import rootRouter from './routes'

const app = express()

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
// app.use(helmet()); // <-- security (use later)
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())


app.use('/api', rootRouter)

app.use((error, _req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(error?.response?.status || 500).json({ message: error.message })
  } else {
    console.log('[ERROR]: ', error)
    res.status(error?.response?.status || 500).json({ message: error.message, error })
  }
})

export default app
