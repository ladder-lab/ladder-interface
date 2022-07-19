import AppBody from 'components/AppBody'
import { Box, Typography } from '@mui/material'

export default function Pool() {
  return (
    <AppBody>
      <Box>
        <Typography>Liquid provider rewards</Typography>
        <Typography>
          Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to
          the pool, accrue in real time and can be claimed by withdrawing your liquidity. Read more about providing
          liquidity
        </Typography>
      </Box>
    </AppBody>
  )
}
