import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.port || 8000

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
