import { useState } from 'react'
import AppBody from 'components/AppBody'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Box, useTheme, Typography, Button, Slider, styled, ButtonBase } from '@mui/material'
import Card from 'components/Card'
import { ETHER } from 'constants/token'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import { ReactComponent as AddCircle } from 'assets/svg/add_circle.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import PositionCard from './PositionCard'

enum Mode {
  SIMPLE,
  DETAIL
}

export default function RemoveLiquidity() {
  const [mode /*setMode*/] = useState(Mode.DETAIL)
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
          <Button sx={{ borderRadius: '12px', height: 59 }} onClick={() => setShowConfirm(true)}>
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
      {mode === Mode.DETAIL && <StyledSlider />}
      <Box display="flex" gap={24} justifyContent="center">
        <Option onClick={() => {}}>25%</Option>
        <Option onClick={() => {}}> 50%</Option>
        <Option onClick={() => {}}>75%</Option>
        <Option onClick={() => {}}>MAX</Option>
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
          {mode === Mode.SIMPLE ? 'Simple' : 'Detailed'}
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

const StyledSlider = styled(Slider)({
  // color: 'linear-gradient(19.49deg, #CAF400 -1.57%, #00E4DD 88.47%)',
  height: 4,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'black',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
})

const Option = styled(ButtonBase)(({ theme }) => ({
  width: 76,
  height: 41,
  background: theme.palette.background.paper,
  borderRadius: '12px',
  color: theme.palette.text.secondary,
  fontSize: 14
}))
