import { useState } from 'react'
import AppBody from 'components/AppBody'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Box, useTheme, Typography, Button } from '@mui/material'
import Card from 'components/Card'
import { ETHER } from 'constants/token'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import { ReactComponent as AddCircle } from 'assets/svg/add_circle.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import PositionCard from './PositionCard'

enum Mode {
  Simple,
  Detailed
}

export default function RemoveLiquidity() {
  const [mode /*setMode*/] = useState(Mode.Simple)
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <>
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
        <InputCard value="0.91234" balance="1234.45678" currency0={ETHER} currency1={ETHER} />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <ArrowCircle />
        </Box>
        <OutputCard value="0.91234" currency={ETHER} />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <AddCircle />
        </Box>
        <OutputCard value="70" currency={ETHER} />
        <Box display="flex" justifyContent="space-between" mt={36} mb={52}>
          <Typography sx={{ fontSize: 18 }}>Price</Typography>
          <Box display="grid" gap={12}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 DAI = 0.02414876 Tickets for the com...
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 Tickets for the com... = 4.1486 DAI
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={8}>
          <Button sx={{ borderRadius: '12px', height: 59 }} onClick={() => {}}>
            Approve
          </Button>
          <Button
            sx={{
              borderRadius: '12px',
              height: 59,
              background: theme.palette.action.disabledBackground,
              color: theme.palette.text.secondary
            }}
            onClick={() => {}}
          >
            Remove
          </Button>
        </Box>
      </AppBody>
      <Box maxWidth={680} width="100%" mt={30}>
        <PositionCard from={ETHER} to={ETHER} />
      </Box>
    </>
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

function InputCard({
  value,
  balance,
  currency0,
  currency1
}: {
  value: string
  balance: string
  currency0: AllTokens
  currency1: AllTokens
}) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Input</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value}</Typography>
        </Box>
        <Box display="grid" gap={14}>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>Balance: {balance}</Typography>
          <Box display="flex" gap={11} alignItems="center">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
            <Typography>
              {currency0.symbol}: {currency1.symbol}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

function OutputCard({ value, currency }: { value: string; currency: AllTokens }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Output</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value}</Typography>
        </Box>
        <Box display="flex" gap={12} width={180}>
          <CurrencyLogo currency={currency} />
          <Typography>{currency.symbol}</Typography>
        </Box>
      </Box>
    </Card>
  )
}
