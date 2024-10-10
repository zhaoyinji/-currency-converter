import { useState } from 'react'
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'

const SERVER_URL = 'http://127.0.0.1:4000'

function App() {
  const [targetCurrency, setTargetCurrency] = useState('USD')
  const [amount, setAmount] = useState(1)
  const [result, setResult] = useState(0)

  const handleChange = (event: SelectChangeEvent) => {
    setTargetCurrency(event.target.value as string)
  }

  const getRate = async (): Promise<void> => {
    const response = await fetch(`${SERVER_URL}/csrf-token`)
    const { token } = await response.json()
    console.log('the token', token)

    const post = await fetch(`${SERVER_URL}/api/conversion`, {
      method: 'POST',
      headers: {
        'x-csrf-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceCurrency: 'EUR',
        targetCurrency,
        amount,
      }),
    })

    const data = await post.json()
    setResult(data.convertedValue)
  }

  const handleGetRate = (): void => {
    void getRate()
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Currency Converter</Typography>
      <Stack direction="row" alignItems={'center'} spacing={2}>
        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            endAdornment={
              <InputAdornment position="start">Euro</InputAdornment>
            }
            label="Amount"
            value={amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </FormControl>
        <ArrowRightAltIcon />
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="demo-simple-select-label">Target Currency</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={targetCurrency}
            label="Target Currency"
            onChange={handleChange}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="JPY">JPY</MenuItem>
            <MenuItem value="NOK">NOK</MenuItem>
            <MenuItem value="SEK">SEK</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
            <MenuItem value="CHF">CHF</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" size="large" onClick={handleGetRate}>
          Get Rate
        </Button>
      </Stack>
      {!!result && (
        <Typography variant="h2">
          Result: {Intl.NumberFormat().format(result)} {targetCurrency}
        </Typography>
      )}
    </Stack>
  )
}

export default App
