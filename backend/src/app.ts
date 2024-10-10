import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import conversionRoutes from './routes/conversionRoutes'
import dotenv from 'dotenv'
import { doubleCsrf } from 'csrf-csrf'
import cookieParser from 'cookie-parser'

const CSRF_COOKIE_NAME = 'X-Csrf-Token'

dotenv.config()

const app = express()

app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:3000',
}))
app.use(express.json())
app.use(helmet())

const { generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET as string,
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  })

app.use(cookieParser(process.env.CSRF_SECRET))

app.get('/csrf-token', (req, res) => {
  return res.json({
    token: generateToken(req, res),
  })
})

// app.use(doubleCsrfProtection)
app.use('/api/conversion', conversionRoutes)

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})

export default app
