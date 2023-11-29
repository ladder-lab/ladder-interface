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
import { checkTokenType, filter1155, getTokenText } from 'utils/checkIs1155'
import { useActiveWeb3React } from 'hooks'
import { replaceNativeTokenName } from 'utils'

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
  slippageAdjustedAmounts,
  tokenIds
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
  tokenIds?: Array<string | number>
}) {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const { token1Text, token2Text } = getTokenText(to, from)

  return (
    <Modal closeIcon customIsOpen={isOpen} customOnDismiss={onDismiss}>
      <Box padding={{ xs: '30px 20px', md: '33px 32px' }}>
        <Typography fontSize={28} mb={39} fontWeight={500}>
          Confirm Swap
        </Typography>
        <SwapPanel
          from={from}
          to={to}
          fromVal={trade?.inputAmount.toFixed(6) ?? '-'}
          toVal={trade?.outputAmount.toFixed(6) ?? '-'}
          tokenIds={tokenIds}
        />
        <Typography fontSize={16} mt={16} mb={24}>
          {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {replaceNativeTokenName(token1Text, chainId) ?? '-'}{' '}
          = {trade?.inputAmount.toFixed(6)} {replaceNativeTokenName(token2Text, chainId)}
        </Typography>
        {showAcceptChanges && <PriceUpdateNotification onDismiss={onAcceptChanges} />}
        <Typography sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 24, mb: 24 }}>
          Output is estimated.You will receive at least {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{' '}
          {token1Text} or the transaction will revert.
        </Typography>
        <SwapDetails
          ExpectedQty={trade?.outputAmount?.toFixed(6) ?? ''}
          priceImpact={priceImpact ?? ''}
          slippage={allowedSlippage / 100 + ''}
          MinReceiveQty={slippageAdjustedAmounts.OUTPUT?.toFixed(6) ?? ''}
          NetworkFee="0"
          toAsset={to}
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
  type,
  tokenIds
}: {
  asset?: AllTokens
  value: string
  approx?: string
  type: string
  tokenIds?: Array<string | number>
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 14, position: 'relative', width: '100%', alignItems: 'center' }}>
        <CurrencyLogo currency={asset} size="36px" />
        <Box display="grid" gap={5}>
          <Typography fontSize={24} sx={{ wordBreak: 'break-all' }}>
            {value}
          </Typography>
          {approx && (
            <Typography sx={{ fontSize: 12, color: theme => theme.palette.text.secondary }}>~${approx}</Typography>
          )}
        </Box>
      </Box>
      <Box display={'flex'} flexDirection="column" gap={8} alignItems="flex-end" width="50%">
        <Tag>{type}</Tag>
        <Typography fontSize={16} textAlign="right">
          {type !== 'ERC20' ? asset?.name : asset?.symbol}
          {type === 'ERC1155' ? `#${filter1155(asset)?.tokenId}` : ''}
        </Typography>
        {tokenIds && type === 'ERC721' && (
          <Typography textAlign={'right'}>{tokenIds.map(id => ` #${id}`).join(',')}</Typography>
        )}
      </Box>
    </Box>
  )
}

function SwapPanel({
  from,
  to,
  fromVal,
  toVal,
  tokenIds
}: {
  from?: AllTokens
  to?: AllTokens
  fromVal: string
  toVal: string
  tokenIds?: Array<string | number>
}) {
  const theme = useTheme()

  return (
    <Box sx={{ background: theme.palette.background.default, padding: '12px 20px', borderRadius: '8px' }}>
      <SwapPanelRow asset={from} value={fromVal} type={from ? checkTokenType(from) : '-'} tokenIds={tokenIds} />
      <ArrowDownwardIcon />
      <SwapPanelRow asset={to} value={toVal} type={to ? checkTokenType(to) : '-'} tokenIds={tokenIds} />
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
  NetworkFee,
  toAsset
}: {
  ExpectedQty: string
  priceImpact: string
  slippage: string
  MinReceiveQty: string
  NetworkFee: string
  toAsset: AllTokens | undefined
}) {
  const theme = useTheme()
  const { token1Text } = getTokenText(toAsset)
  const { chainId } = useActiveWeb3React()

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
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display={'flex'} alignItems="center" gap={9}>
          <Typography>Expected Output</Typography>
          <QuestionHelper text={HelperText.expectedOuptut} />
        </Box>

        <Typography sx={{ wordBreak: 'break-all' }}>
          {ExpectedQty} {ExpectedQty.length > 22 && <br />}{' '}
          <span style={{ color: theme.palette.text.secondary }}>
            {replaceNativeTokenName(token1Text, chainId) ?? '-'}
          </span>
        </Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography>Price Impact</Typography>
          <QuestionHelper text={HelperText.priceImpact} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>{priceImpact}%</Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Minimum received <br />
            after slippage ({slippage}%)
          </Typography>
          <QuestionHelper text={HelperText.minReceived} />
        </Box>

        <Typography>
          {MinReceiveQty}
          {MinReceiveQty.length > 22 && <br />}{' '}
          <span style={{ color: theme.palette.text.secondary }}>
            {replaceNativeTokenName(token1Text, chainId) ?? '-'}
          </span>
        </Typography>
      </Box>
      <Box display={{ xs: 'grid', md: 'flex' }} justifyContent="space-between" alignItems="center" gap={3}>
        <Box display="flex" alignItems="center" gap={9}>
          <Typography sx={{ color: theme.palette.text.secondary }}>Network Fee</Typography>
          <QuestionHelper text={HelperText.networkFee} />
        </Box>

        <Typography sx={{ color: theme.palette.text.secondary }}>~${NetworkFee}</Typography>
      </Box>
    </Box>
  )
}
