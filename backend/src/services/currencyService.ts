import axios from 'axios'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 3600 })

export const getExchangeRate = async (
  sourceCurrency: string,
  targetCurrency: string,
): Promise<number> => {
  const cacheKey = `${sourceCurrency}-${targetCurrency}`
  const cachedRate = cache.get<number>(cacheKey)

  if (cachedRate) {
    console.log('cached rate: ', cachedRate)
    return cachedRate
  }

  const response = await axios.get(
    `https://swop.cx/rest/rates/${sourceCurrency}/${targetCurrency}`,
    {
      headers: {
        Authorization: `ApiKey ${process.env.SWOP_API_KEY}`,
      },
    },
  )

  const rate = response.data.quote

  cache.set(cacheKey, rate)

  return rate
}
