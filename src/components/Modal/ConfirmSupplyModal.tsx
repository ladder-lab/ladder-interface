import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ActionButton from 'components/Button/ActionButton'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { getTokenText } from 'utils/checkIs1155'
import { TokenAmount } from '@ladder/sdk'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function ConfirmSupplyModal({
  onConfirm,
  shareOfPool,
  isOpen,
  onDismiss,
  liquidityMinted,
  valA,
  valB,
  tokenA,
  tokenB,
  priceA,
  priceB
}: {
  onConfirm: () => void
  isOpen: boolean
  onDismiss: () => void
  liquidityMinted: TokenAmount | undefined
  valA: string
  valB: string
  tokenA?: AllTokens
  tokenB?: AllTokens
  priceA: string
  priceB: string
  shareOfPool: string
}) {
  const theme = useTheme()

  const { Token1Text, Token2Text } = getTokenText(tokenA, tokenB)

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39} fontWeight={500}>
          You will receive
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={32} fontWeight={900}>
            {liquidityMinted?.toExact() ?? '-'}
          </Typography>
          <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} size={28} />
        </Box>

        <Typography fontSize={16} mt={4} mb={12}>
          <Token1Text fontSize={16} /> /<Token2Text fontSize={16} />
        </Typography>
        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mb: 24 }}>
          Output is estimated.If the price changes by more than 5% your transaction will revert.
        </Typography>
        <AddLiquidityDetails
          token1={tokenA}
          token2={tokenB}
          token1Val={valA}
          token2Val={valB}
          rateToken1Token2={priceA}
          rateToken2Token1={priceB}
          shareOfPool={shareOfPool}
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
  const { Token2Text, Token1Text } = getTokenText(token1, token2)

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
          <Typography>
            <Token1Text /> <span style={{ color: theme.palette.text.primary }}> Deposited</span>
          </Typography>
        </Box>

        <Typography display={'flex'} alignItems="center" gap={8}>
          <CurrencyLogo currency={token1} size={'18px'} />
          {token1Val}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography>
            <Token2Text /> <span style={{ color: theme.palette.text.primary }}>Deposited</span>
          </Typography>
        </Box>

        <Typography display={'flex'} alignItems="center" gap={8}>
          <CurrencyLogo currency={token2} size={'18px'} />
          {token2Val}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" margin="20px 0">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Rates</Typography>
        </Box>
        <Box display="grid" gap={8}>
          <Typography>
            1 <Token1Text /> = {rateToken1Token2} <Token2Text />
          </Typography>
          <Typography>
            1 <Token2Text /> = {rateToken2Token1} <Token1Text />
          </Typography>
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
