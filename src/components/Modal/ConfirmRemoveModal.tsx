import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ActionButton from 'components/Button/ActionButton'
import { AllTokens } from 'models/allTokens'
import AddIcon from '@mui/icons-material/Add'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

export default function ConfirmRemoveModal({
  onConfirm,
  isOpen,
  onDismiss,
  val,
  tokenA,
  tokenB,
  priceA,
  priceB
}: {
  onConfirm: () => void
  isOpen: boolean
  onDismiss: () => void
  val: string
  tokenA?: AllTokens
  tokenB?: AllTokens
  priceA: string
  priceB: string
}) {
  const theme = useTheme()

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39} fontWeight={500}>
          You will receive
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={32} fontWeight={900}>
            0.675
          </Typography>
          <Typography fontSize={20} fontWeight={400}>
            DAI
          </Typography>
        </Box>
        <AddIcon sx={{ color: theme.palette.text.secondary, ml: 8 }} />
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={32} fontWeight={900}>
            70
          </Typography>
          <Typography fontSize={20} fontWeight={400}>
            Tickets for  the community #56
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mb: 24 }}>
          Output is estimated.If the price changes by more than 5% your transaction will revert.
        </Typography>
        <RemoveLiquidityDetails
          token1={tokenA}
          token2={tokenB}
          lpValue={val}
          rateToken1Token2={priceA}
          rateToken2Token1={priceB}
        />
        <ActionButton onAction={onConfirm} actionText="Confirm Supply" />
      </Box>
    </Modal>
  )
}

function RemoveLiquidityDetails({
  token1,
  token2,
  lpValue,
  rateToken1Token2,
  rateToken2Token1
}: {
  token1?: AllTokens
  token2?: AllTokens
  lpValue: string
  rateToken1Token2: string
  rateToken2Token1: string
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
      <Box display="flex" justifyContent="space-between">
        <Typography>
          LP {token1?.symbol}: <span style={{ color: theme.palette.text.secondary }}>{token2?.symbol}...</span> Burned
        </Typography>
        <Box display="flex" gap={8}>
          <DoubleCurrencyLogo currency0={token1} currency1={token2} />
          <Typography>{lpValue}</Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>Price</Typography>
        <Box display="grid" gap={8}>
          <Typography>
            1 DAI = {rateToken1Token2} <span style={{ color: theme.palette.text.secondary }}>Tickets for the c...</span>
          </Typography>
          <Typography>
            1 <span style={{ color: theme.palette.text.secondary }}>Tickets for the c...</span>= {rateToken2Token1} DAI
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
