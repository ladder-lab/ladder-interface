import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { Typography, Box, Button, ButtonBase } from '@mui/material'
import { CurrencyAmount, JSBI, Trade } from '@uniswap/sdk'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as SwitchCircle } from 'assets/svg/switch_circle.svg'
import Settings from 'components/essential/Settings'
import { AssetAccordion } from './AssetAccordion'
import { SwapSummary } from './SwapSummary'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { AllTokens } from 'models/allTokens'
import ConfirmSwapModal from 'components/Modal/ConfirmSwapModal'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from 'state/user/hooks'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { ApprovalState, useAllTokenApproveCallback } from 'hooks/useApproveCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/swap/prices'
import confirmPriceImpactWithoutFee from 'utils/swap/confirmPriceImpactWithoutFee'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { Currency } from 'constants/token'
import QuestionHelper from 'components/essential/QuestionHelper'

export default function Swap() {
  // const theme = useTheme()
  const { account } = useActiveWeb3React()

  const [summaryExpanded, setSummaryExpanded] = useState(false)
  // modal and loading
  const [{ showConfirm, tradeToConfirm, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    txHash: undefined
  })

  const { showModal, hideModal } = useModal()
  const toggleWallet = useWalletModalToggle()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const [isExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient } = useSwapState()

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const { [Field.INPUT]: fromAsset, [Field.OUTPUT]: toAsset } = currencies
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  )

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // approve work flow
  // const [approval1155, approve1155Callback] = useApproveERC1155Callback(filter1155(fromAsset))
  const [approval, approveCallback] = useAllTokenApproveCallback(fromAsset, slippageAdjustedAmounts[Field.INPUT])
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const handleApprove = useCallback(() => {
    approveCallback()
  }, [approveCallback])

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    } else {
      setApprovalSubmitted(false)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    showModal(<TransacitonPendingModal />)
    setSwapState(prev => ({ ...prev, attemptingTxn: true, showConfirm: false, txHash: undefined }))
    swapCallback()
      .then(hash => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
        setSwapState(prev => ({ ...prev, attemptingTxn: false, txHash: hash }))
      })
      .catch(error => {
        hideModal()
        showModal(<MessageBox type="error">{error.message}</MessageBox>)
        setSwapState(prev => ({
          ...prev,
          attemptingTxn: false,
          txHash: undefined
        }))
      })
  }, [hideModal, priceImpactWithoutFee, showModal, swapCallback])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState(prev => ({ ...prev, showConfirm: false, tradeToConfirm, attemptingTxn, txHash }))
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState(prev => ({ ...prev, tradeToConfirm: trade }))
  }, [trade])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleFromVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUserInput(Field.INPUT, e.target.value)
    },
    [onUserInput]
  )

  const handleToVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onUserInput(Field.OUTPUT, e.target.value)
    },
    [onUserInput]
  )

  const handleFromAsset = useCallback(
    (currency: AllTokens) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currency)
    },
    [onCurrencySelection]
  )

  const handleToAsset = useCallback(
    (currency: AllTokens) => {
      onCurrencySelection(Field.OUTPUT, currency)
    },
    [onCurrencySelection]
  )

  const error = useMemo(() => {
    if (!fromAsset || !toAsset) {
      return 'Select a Token'
    }

    return undefined
  }, [fromAsset, toAsset])

  return (
    <>
      <ConfirmSwapModal
        onConfirm={handleSwap}
        from={fromAsset ?? undefined}
        to={toAsset ?? undefined}
        isOpen={showConfirm}
        onDismiss={handleConfirmDismiss}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        allowedSlippage={allowedSlippage}
        priceImpact={priceImpactWithoutFee?.toFixed()}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
      />
      <AppBody width={'100%'} maxWidth={'680px'}>
        <Box
          sx={{
            padding: { xs: '24px 20px 20px', md: '33px 32px 30px' },
            position: 'relative'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: {
                xs: 20,
                md: 28
              },
              mb: {
                xs: 32,
                md: 45
              }
            }}
          >
            SWAP
          </Typography>

          <Settings />
          <Box mb={fromAsset ? 16 : 0}>
            <CurrencyInputPanel
              value={formattedAmounts[Field.INPUT]}
              onChange={handleFromVal}
              onSelectCurrency={handleFromAsset}
              currency={fromAsset}
              onMax={handleMaxInput}
              disabled={!account}
            />
          </Box>
          {/* {fromAsset && <AssetAccordion token={fromAsset} />} */}
          <Box
            sx={{
              paddingBottom: 12,
              margin: '0 auto',
              paddingLeft: 362,
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <SwitchCircle
              onClick={account ? onSwitchTokens : undefined}
              style={{ cursor: account ? 'pointer' : 'auto' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 12, mt: 16 }}>
              <SwapTypeButton selected={true} text="Auto" helperText="auto..." onClick={() => {}} />
              <SwapTypeButton
                selected={false}
                text="Choose by yourself"
                helperText="choose by yourself..."
                onClick={() => {}}
              />
            </Box>
          </Box>
          <Box mb={toAsset ? 16 : 0}>
            <CurrencyInputPanel
              // selectedTokenType={fromAsset ? ('tokenId' in fromAsset ? 'erc1155' : 'erc20') : undefined}
              value={formattedAmounts[Field.OUTPUT]}
              onChange={handleToVal}
              onSelectCurrency={handleToAsset}
              currency={toAsset}
              disabled={!account}
            />
          </Box>
          {/* {toAsset && <AssetAccordion token={toAsset} />} */}
          {isValid && !swapCallbackError && (
            <SwapSummary
              fromAsset={fromAsset ?? undefined}
              toAsset={toAsset ?? undefined}
              toVal={formattedAmounts[Field.OUTPUT]}
              price={v2Trade?.executionPrice.toFixed() ?? '-'}
              expanded={summaryExpanded}
              onChange={() => setSummaryExpanded(!summaryExpanded)}
              margin="20px 0 0"
              gasFee="8.23"
              slippage={+(priceImpactWithoutFee?.toFixed() ?? 0)}
              minReceiveQty={slippageAdjustedAmounts.OUTPUT?.toExact() ?? '-'}
              routerTokens={trade?.route.path.slice(1, -1)}
            />
          )}
          <Box mt={40}>
            {!account ? (
              <Button onClick={toggleWallet}>Connect Wallet</Button>
            ) : showWrap ? (
              <Button disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
              </Button>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <Button disabled style={{ textAlign: 'center' }}>
                <Typography mb="4px">
                  Insufficient liquidity for this trade. {singleHopOnly && 'Try enabling multi-hop trades.'}
                </Typography>
              </Button>
            ) : (
              <Box display="grid" gap="16px">
                {showApproveFlow && (
                  <ActionButton
                    onAction={handleApprove}
                    actionText={
                      approvalSubmitted && approval === ApprovalState.APPROVED
                        ? 'Approved'
                        : `Allow the Ladder to use your ${currencies[Field.INPUT]?.symbol}`
                    }
                    error={error}
                    disableAction={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    pending={approval === ApprovalState.PENDING}
                    pendingText="Approving"
                  />
                )}
                <ActionButton
                  actionText={`Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  onAction={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        showConfirm: true,
                        txHash: undefined
                      })
                    }
                  }}
                  disableAction={
                    !isValid ||
                    (priceImpactSeverity > 3 && !isExpertMode) ||
                    !!swapCallbackError ||
                    (showApproveFlow && approval !== ApprovalState.APPROVED)
                  }
                  error={
                    swapInputError
                      ? swapInputError
                      : priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact Too High`
                      : undefined
                  }
                />
              </Box>
            )}
          </Box>
        </Box>
      </AppBody>
      {(fromAsset || toAsset) && <TokenInfo fromAsset={fromAsset} toAsset={toAsset} />}
    </>
  )
}

function TokenInfo({ fromAsset, toAsset }: { fromAsset?: Currency; toAsset?: Currency }) {
  return (
    <AppBody width={'100%'} maxWidth={'680px'} sx={{ marginTop: 33 }}>
      <Box
        sx={{
          padding: { xs: '24px 20px 20px', md: '33px 32px 30px' },
          position: 'relative'
        }}
      >
        <Typography fontSize={28} fontWeight={500} mb={20}>
          Token Info
        </Typography>
        <Box display="flex" flexDirection="column" gap={12}>
          {fromAsset && <AssetAccordion token={fromAsset} />}
          {toAsset && <AssetAccordion token={toAsset} />}
        </Box>
      </Box>
    </AppBody>
  )
}

function SwapTypeButton({
  onClick,
  text,
  helperText,
  selected
}: {
  onClick: () => void
  text: string
  helperText: string
  selected: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        height: 22,
        padding: '0 12px',
        borderRadius: '10px',
        background: theme => (selected ? theme.palette.background.default : 'none'),
        border: theme => `1px solid ${selected ? 'none' : theme.palette.primary.main}`
      }}
    >
      <Typography sx={{ color: theme => theme.palette.primary.main, mr: 4 }}>{text}</Typography>
      <QuestionHelper text={helperText} />
    </ButtonBase>
  )
}
