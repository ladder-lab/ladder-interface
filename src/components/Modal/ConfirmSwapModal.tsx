import { useState } from 'react'
import { Typography, Box, Button, useTheme, styled } from '@mui/material'
import Modal from 'components/Modal'
import { Currency } from 'constants/token'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useIsDarkMode } from 'state/user/hooks'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QuestionHelper from 'components/essential/QuestionHelper'
import ActionButton from 'components/Button/ActionButton'
import { HelperText } from 'constants/helperText'

export default function ConfirmSwapModal({
  onConfirm,
  from,
  to,
  fromVal,
  toVal
}: {
  onConfirm: () => void
  from?: Currency
  to?: Currency
  fromVal: string
  toVal: string
}) {
  const theme = useTheme()
  const [showNotify, setShowNotify] = useState(true)

  return (
    <Modal closeIcon>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39}>
          Confirm Swap
        </Typography>
        <SwapPanel from={from} to={to} fromVal={fromVal} toVal={toVal} />
        <Typography fontSize={16} mt={16} mb={24}>
          1 Tickets for the...= 0.254587 DAI ($1.0000)
        </Typography>
        {showNotify && <PriceUpdateNotification onDismiss={() => setShowNotify(false)} />}
        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 24, mb: 24 }}>
          Output is estimated.You will receive at least 2 Tickets for the community #56 or the transaction will revert.
        </Typography>
        <SwapDetails ExpectedNftQty="50" priceImpact="0.41" slippage="13.36" MinReceiveNftQty="48" NetworkFee="8.23" />
        <ActionButton onAction={onConfirm} actionText="Confirm Swap" error={showNotify ? 'Confirm Swap' : undefined} />
      </Box>
    </Modal>
  )
}

function SwapPanelRow({
  asset,
  value,
  approx,
  type
}: {
  asset?: Currency
  value: string
  approx: string
  type: string
}) {
  const darkMode = useIsDarkMode()

  const Tag = styled(Box)({
    borderRadius: '10px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
    fontSize: 12,
    padding: '4px 12px',
    background: darkMode ? '#484D50' : '#FFFFFF'
  })

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 14, position: 'relative', width: '100%', alignItems: 'center' }}>
        <CurrencyLogo currency={asset} size="36px" />
        <Box display="grid" gap={5}>
          <Typography fontSize={24}>{value}</Typography>
          <Typography sx={{ fontSize: 12, color: theme => theme.palette.text.secondary }}>~${approx}</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={8} alignItems="flex-end">
        <Tag>{type}</Tag>
        <Typography fontSize={20}>{asset?.symbol}</Typography>
      </Box>
    </Box>
  )
}

function SwapPanel({ from, to, fromVal, toVal }: { from?: Currency; to?: Currency; fromVal: string; toVal: string }) {
  const theme = useTheme()

  return (
    <Box sx={{ background: theme.palette.background.default, padding: '12px 20px', borderRadius: '8px' }}>
      <SwapPanelRow asset={from} value={fromVal} approx={'123'} type="ERC20" />
      <ArrowDownwardIcon />
      <SwapPanelRow asset={to} value={toVal} approx={'123'} type="ERC1155" />
    </Box>
  )
}

function PriceUpdateNotification({ onDismiss }: { onDismiss: () => void }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        background: theme.gradient.gradient3,
        height: 67,
        display: 'flex',
        borderRadius: '8px',
        padding: '0 25px 0 12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box display="flex" alignItems="center">
        <WarningAmberIcon />
        <Typography ml={10}>Price Updated</Typography>
      </Box>

      <Button onClick={onDismiss} sx={{ background: theme.gradient.gradient1, width: 97, height: 44 }}>
        Accept
      </Button>
    </Box>
  )
}

function SwapDetails({
  ExpectedNftQty,
  priceImpact,
  slippage,
  MinReceiveNftQty,
  NetworkFee
}: {
  ExpectedNftQty: string
  priceImpact: string
  slippage: string
  MinReceiveNftQty: string
  NetworkFee: string
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
          <Typography>Expected Output</Typography>
          <QuestionHelper text={HelperText.expectedOuptut} />
        </Box>

        <Typography>
          {ExpectedNftQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography>Price Impact</Typography>
          <QuestionHelper text={HelperText.priceImpact} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>{priceImpact}%</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Minimum received after slippage ({slippage}%)
          </Typography>
          <QuestionHelper text={HelperText.minReceived} />
        </Box>

        <Typography>
          {MinReceiveNftQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Network Fee</Typography>
          <QuestionHelper text={HelperText.networkFee} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>~${NetworkFee}</Typography>
      </Box>
    </Box>
  )
}
