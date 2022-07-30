import { Typography, Box, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ActionButton from 'components/Button/ActionButton'
import { AllTokens } from 'models/allTokens'
import AddIcon from '@mui/icons-material/Add'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import Tag from 'components/Tag'
import { getTokenText } from 'utils/checkIs1155'

export default function ConfirmRemoveModal({
  onConfirm,
  isOpen,
  onDismiss,
  val,
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
  val: string
  valA: string
  valB: string
  tokenA?: AllTokens
  tokenB?: AllTokens
  priceA: string
  priceB: string
}) {
  const theme = useTheme()
  const { token1Text, token2Text } = getTokenText(tokenA, tokenB)

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Box display="flex" alignItems="center" mb={39}>
          <Typography fontSize={28} fontWeight={500}>
            You will receive
          </Typography>
          <Box ml={20} display="flex" gap={16}>
            <Tag>ERC20</Tag>
            <Tag>ERC1155</Tag>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={32} fontWeight={900}>
            {valA}
          </Typography>
          <Typography fontSize={20} fontWeight={400}>
            {token1Text}
          </Typography>
        </Box>
        <AddIcon sx={{ color: theme.palette.text.secondary, ml: 8 }} />
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={32} fontWeight={900}>
            {valB}
          </Typography>
          <Typography fontSize={20} fontWeight={400}>
            {token2Text}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mb: 24 }} mt={20}>
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
  const { Token1Text, Token2Text } = getTokenText(token1, token2)

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
        <Typography fontSize={16} fontWeight={500}>
          LP{' '}
          {/* <Token1Text fontSize={16} />:{' '}
          <span style={{ color: theme.palette.text.secondary }}>
            <Token2Text />
          </span>{' '} */}
          Burned
        </Typography>
        <Box display="flex" gap={8} alignItems="center" justifyItems={'flex-end'}>
          <DoubleCurrencyLogo currency0={token1} currency1={token2} size={18} />
          <Typography fontSize={16} fontWeight={500}>
            {lpValue}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={500}>
          Price
        </Typography>
        <Box display="grid" gap={8} justifyItems={'flex-end'}>
          <Typography fontSize={16} fontWeight={400}>
            1 <Token1Text fontSize={16} /> = {rateToken1Token2} <Token2Text fontSize={16} />
          </Typography>
          <Typography fontSize={16} fontWeight={400}>
            1 <Token2Text fontSize={16} />= {rateToken2Token1} <Token1Text fontSize={16} />
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
