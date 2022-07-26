import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { Typography, Box, useTheme, Button } from '@mui/material'
import { CurrencyAmount, JSBI, Trade } from '@uniswap/sdk'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
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
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/swap/prices'
import confirmPriceImpactWithoutFee from 'utils/swap/confirmPriceImpactWithoutFee'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'

export default function Swap() {
  const theme = useTheme()
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

  const { /*onSwitchTokens,*/ onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
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
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, txHash: undefined })
    swapCallback()
      .then(hash => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, txHash: hash })
      })
      .catch(error => {
        hideModal()
        showModal(<MessageBox type="error">{error.message}</MessageBox>)
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          txHash: undefined
        })
      })
  }, [hideModal, priceImpactWithoutFee, showConfirm, showModal, swapCallback, tradeToConfirm])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState(prev => ({ ...prev, showConfirm: false, tradeToConfirm, attemptingTxn, txHash }))
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, trade, txHash])

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
        isOpen={false}
        onDismiss={handleConfirmDismiss}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        allowedSlippage={allowedSlippage}
      />
      <AppBody width={'100%'} maxWidth={'680px'}>
        <Box
          sx={{
            padding: '33px 32px 30px',
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
          <Box
            sx={{
              position: 'absolute',
              right: 32,
              top: 24,
              background: theme.palette.background.default,
              borderRadius: '8px',
              width: 52,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings />
          </Box>
          <Box mb={fromAsset ? 16 : 0}>
            <CurrencyInputPanel
              value={formattedAmounts[Field.INPUT]}
              onChange={handleFromVal}
              onSelectCurrency={handleFromAsset}
              currency={fromAsset}
              onMax={handleMaxInput}
            />
          </Box>
          {fromAsset && <AssetAccordion token={fromAsset} />}
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box mb={toAsset ? 16 : 0}>
            <CurrencyInputPanel
              selectedTokenType={fromAsset ? ('tokenId' in fromAsset ? 'erc1155' : 'erc20') : undefined}
              value={formattedAmounts[Field.OUTPUT]}
              onChange={() => {}}
              disableInput={true}
              onSelectCurrency={handleToAsset}
              currency={toAsset}
            />
          </Box>
          {toAsset && <AssetAccordion token={toAsset} />}
          <SwapSummary
            fromAsset={fromAsset ?? undefined}
            toAsset={toAsset ?? undefined}
            expanded={summaryExpanded}
            onChange={() => setSummaryExpanded(!summaryExpanded)}
            margin="20px 0 40px"
            gasFee="8.23"
            currencyPrice={'123'}
            currencyRate={'1.000'}
            expectedNftQty={'50'}
            priceImpact={'0.41'}
            minReceiveNftQty={'48'}
            slippage="13.68"
          />
          <Box>
            {!account ? (
              <Button onClick={toggleWallet}>Connect Wallet</Button>
            ) : showWrap ? (
              <Button disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
              </Button>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <Button disabled style={{ textAlign: 'center' }}>
                <Typography mb="4px">Insufficient liquidity for this trade.</Typography>
                {singleHopOnly && <Typography mb="4px">Try enabling multi-hop trades.</Typography>}
              </Button>
            ) : showApproveFlow ? (
              <Box>
                <ActionButton
                  onAction={() => {
                    approveCallback()
                    showModal(<TransacitonPendingModal />)
                  }}
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
                <Button
                  onClick={() => {
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
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  // error={isValid && priceImpactSeverity > 2}
                >
                  {priceImpactSeverity > 3 && !isExpertMode
                    ? `Price Impact High`
                    : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                </Button>
              </Box>
            ) : (
              <Button
                onClick={() => {
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
                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                // error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                {swapInputError
                  ? swapInputError
                  : priceImpactSeverity > 3 && !isExpertMode
                  ? `Price Impact Too High`
                  : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
              </Button>
            )}
          </Box>
        </Box>
      </AppBody>
    </>
  )
}
