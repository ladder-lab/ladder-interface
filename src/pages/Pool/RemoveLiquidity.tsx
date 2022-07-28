import { useState } from 'react'
import AppBody from 'components/AppBody'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Box, useTheme, Typography } from '@mui/material'
import Card from 'components/Card'

enum Mode {
  Simple,
  Detailed
}

export default function RemoveLiquidity() {
  const [mode /*setMode*/] = useState(Mode.Simple)
  const navigate = useNavigate()

  return (
    <AppBody
      width={'100%'}
      maxWidth={'680px'}
      onReturnClick={() => navigate(routes.pool)}
      title="Remove Liquidity"
      sx={{ padding: '24px 32px' }}
      setting
    >
      <Tips />
      <NumericalCard mode={mode} />
    </AppBody>
  )
}

function Tips() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        background: theme.palette.background.default,
        padding: '16px 20px',
        borderRadius: '8px',
        mb: 20,
        mt: 24
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: theme.palette.text.secondary }}>
        Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically
        earn fees proportional to your share of the pool, and can be redeemed at any time.
      </Typography>
    </Box>
  )
}

function NumericalCard({ mode }: { mode: Mode }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px 20px" style={{ position: 'relative' }}>
      <Box display="grid" gap={15}>
        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Remove Amount</Typography>
        <Typography sx={{ fontSize: 40, fontWeight: 900 }}>50%</Typography>
      </Box>

      <Box
        sx={{
          width: 103,
          height: 41,
          borderRadius: '12px',
          background: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 16,
          right: 20
        }}
      >
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {mode === Mode.Simple ? 'Simple' : 'Detailed'}
        </Typography>
      </Box>
    </Card>
  )
}
