import { useMemo } from 'react'
import { Typography, Box, Button, useTheme } from '@mui/material'
import Modal from 'components/Modal'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QuestionHelper from 'components/essential/QuestionHelper'
import ActionButton from 'components/Button/ActionButton'
import { HelperText } from 'constants/helperText'
import { AllTokens } from 'models/allTokens'
import { CurrencyAmount, currencyEquals, Trade } from '@ladder/sdk'
import { Field } from 'state/swap/actions'
import Tag from 'components/Tag'
import { checkIs1155, checkTokenType, filter1155 } from 'utils/checkIs1155'

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
  allowedSlippage,
  priceImpact,
  slippageAdjustedAmounts
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
  priceImpact?: string
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount | undefined
    OUTPUT?: CurrencyAmount | undefined
  }
}) {
  const theme = useTheme()

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding="33px 32px">
        <Typography fontSize={28} mb={39} fontWeight={500}>
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
        <SwapDetails
          ExpectedQty={trade?.outputAmount?.toExact() ?? ''}
          priceImpact={priceImpact ?? ''}
          slippage={allowedSlippage / 100 + ''}
          MinReceiveQty={slippageAdjustedAmounts.OUTPUT?.toExact() ?? ''}
          NetworkFee="8.23"
        />
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
  approx?: string
  type: string
}) {
  const is1155 = checkIs1155(asset)
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 14, position: 'relative', width: '100%', alignItems: 'center' }}>
        <CurrencyLogo currency={asset} size="36px" />
        <Box display="grid" gap={5}>
          <Typography fontSize={24}>{value}</Typography>
          {approx && (
            <Typography sx={{ fontSize: 12, color: theme => theme.palette.text.secondary }}>~${approx}</Typography>
          )}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={8} alignItems="flex-end" width="50%">
        <Tag>{type}</Tag>
        <Typography fontSize={is1155 ? 16 : 20} textAlign="right">
          {is1155 ? asset?.name : asset?.symbol}
          {is1155 ? ` #${filter1155(asset)?.tokenId}` : ''}
        </Typography>
      </Box>
    </Box>
  )
}

function SwapPanel({ from, to, fromVal, toVal }: { from?: AllTokens; to?: AllTokens; fromVal: string; toVal: string }) {
  const theme = useTheme()

  return (
    <Box sx={{ background: theme.palette.background.default, padding: '12px 20px', borderRadius: '8px' }}>
      <SwapPanelRow asset={from} value={fromVal} type={from ? checkTokenType(from) : '-'} />
      <ArrowDownwardIcon />
      <SwapPanelRow asset={to} value={toVal} type={to ? checkTokenType(to) : '-'} />
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
  ExpectedQty,
  priceImpact,
  slippage,
  MinReceiveQty,
  NetworkFee
}: {
  ExpectedQty: string
  priceImpact: string
  slippage: string
  MinReceiveQty: string
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
          {ExpectedQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
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
          {MinReceiveQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
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
