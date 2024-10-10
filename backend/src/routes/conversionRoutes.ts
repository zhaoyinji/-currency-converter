import { Router } from 'express'
import { getExchangeRate } from '../services/currencyService'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', async function (req, res, next) {
  const { sourceCurrency, targetCurrency, amount } = req.body
  console.log(req.headers["x-csrf-token"])

  try {
    const rate = await getExchangeRate(sourceCurrency, targetCurrency)
    const convertedValue = rate * amount

    res.json({ convertedValue })
  } catch (error) {
    // Pass the error to the next middleware (error handler)
    next(error)
  }
})

export default router
