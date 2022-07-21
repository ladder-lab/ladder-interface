import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ActionButton from 'components/Button/ActionButton'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

export default function ConfirmSupplyModal({
  onConfirm,
  from,
  to,
  fromVal,
  toVal,
  isOpen,
  onDismiss
}: {
  onConfirm: () => void
  from?: AllTokens
  to?: AllTokens
  fromVal: string
  toVal: string
  isOpen: boolean
  onDismiss: () => void
}) {
  const theme = useTheme()

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39}>
          You will receive
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={32} fontWeight={900}>
            26.167681
          </Typography>
          <DoubleCurrencyLogo currency0={from} currency1={to} />
        </Box>

        <Typography fontSize={16} mt={4} mb={12}>
          DAI/Tickets for the community #56
        </Typography>
        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mb: 24 }}>
          Output is estimated.If the price changes by more than 5% your transaction will revert.
        </Typography>
        <AddLiquidityDetails
          token1={from}
          token2={to}
          token1Val={fromVal}
          token2Val={toVal}
          rateToken1Token2={'22.32'}
          rateToken2Token1={'0.0234'}
          shareOfPool="0.2345"
        />
        <ActionButton onAction={onConfirm} actionText="Confirm Supply" />
      </Box>
    </Modal>
  )
}

function AddLiquidityDetails({
  token1,
  token2,
  token1Val,
  token2Val,
  rateToken1Token2,
  rateToken2Token1,
  shareOfPool
}: {
  token1?: AllTokens
  token2?: AllTokens
  token1Val: string
  token2Val: string
  rateToken1Token2: string
  rateToken2Token1: string
  shareOfPool: string
}) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        padding: 20,
        background: theme.palette.background.default,
        borderRadius: '8px',
        display: 'grid',
        gap: 12,
        mb: 40
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography>{token1?.name} Deposited</Typography>
        </Box>

        <Typography>{token1Val}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {token2?.name} <span style={{ color: theme.palette.text.primary }}>Deposited</span>
          </Typography>
        </Box>

        <Typography>{token2Val}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Rates</Typography>
        </Box>
        <Box display="grid" gap={8}>
          <Typography>1 DAI = {rateToken1Token2} Tickets for the c...</Typography>
          <Typography>1 Tickets for the c...= {rateToken2Token1} DAI</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Share of Pool</Typography>
        </Box>

        <Typography>{shareOfPool}%</Typography>
      </Box>
    </Box>
  )
}
