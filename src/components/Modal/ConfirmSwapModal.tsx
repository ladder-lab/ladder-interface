import { useMemo } from 'react'
import { Typography, Box, Button, useTheme, styled } from '@mui/material'
import Modal from 'components/Modal'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { useIsDarkMode } from 'state/user/hooks'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QuestionHelper from 'components/essential/QuestionHelper'
import ActionButton from 'components/Button/ActionButton'
import { HelperText } from 'constants/helperText'
import { AllTokens } from 'models/allTokens'
import { currencyEquals, Trade } from '@uniswap/sdk'
import { computeSlippageAdjustedAmounts } from 'utils/swap/prices'
import { Field } from 'state/swap/actions'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  onConfirm,
  from,
  to,
  isOpen,
  onDismiss,
  onAcceptChanges,
  trade,
  originalTrade,
  allowedSlippage
}: {
  onConfirm: () => void
  from?: AllTokens
  to?: AllTokens
  isOpen: boolean
  onDismiss: () => void
  onAcceptChanges: () => void
  trade: Trade | undefined
  originalTrade: Trade | undefined
  allowedSlippage: number
}) {
  const theme = useTheme()

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  )

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39}>
          Confirm Swap
        </Typography>
        <SwapPanel
          from={from}
          to={to}
          fromVal={trade?.inputAmount.toExact() ?? '-'}
          toVal={trade?.outputAmount.toExact() ?? '-'}
        />
        <Typography fontSize={16} mt={16} mb={24}>
          {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade?.outputAmount.currency.name ?? '-'} ={' '}
          {trade?.inputAmount.toExact()} {trade?.inputAmount.currency.name} ($1.0000)
        </Typography>
        {showAcceptChanges && <PriceUpdateNotification onDismiss={onAcceptChanges} />}
        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 24, mb: 24 }}>
          Output is estimated.You will receive at least {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
          {to?.name} {to && 'tokenId' in to ? `# ${to.tokenId}` : ''} or the transaction will revert.
        </Typography>
        <SwapDetails ExpectedNftQty="50" priceImpact="0.41" slippage="13.36" MinReceiveNftQty="48" NetworkFee="8.23" />
        <ActionButton
          onAction={onConfirm}
          actionText="Confirm Swap"
          error={showAcceptChanges ? 'Confirm Swap' : undefined}
        />
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
  asset?: AllTokens
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

function SwapPanel({ from, to, fromVal, toVal }: { from?: AllTokens; to?: AllTokens; fromVal: string; toVal: string }) {
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
