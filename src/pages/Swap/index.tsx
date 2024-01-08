import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { Typography, Box, Button } from '@mui/material'
import { CurrencyAmount, ETHER, JSBI, Pair, Trade } from '@ladder/sdk'
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
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'
import { Token721 } from 'constants/token/token721'
import { useSwap721State } from 'state/swap/useSwap721State'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import usePriceCorrection from 'hooks/usePriceCorrection'
import { useNavigate, useParams } from 'react-router-dom'
import { liquidityParamBuilder, liquidityParamSplitter, routes } from 'constants/routes'
import { useCurrency } from 'hooks/Tokens'
import { replaceErrorMessage } from 'utils'
import { useToken721BalanceTokens } from 'state/wallet/hooks'

export default function Swap() {
  // const theme = useTheme()
  useToken721BalanceTokens()
  const { account, chainId } = useActiveWeb3React()
  const navigate = useNavigate()

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

  const { currencyIdA, currencyIdB, tokenIds } = useParams()
  const [tokenIdA, tokenIdB] = tokenIds?.split(liquidityParamSplitter) ?? ['', '']
  const [currency0, currency1] = [
    useCurrency(currencyIdA, tokenIdA) ?? undefined,
    useCurrency(currencyIdB, tokenIdB) ?? undefined
  ]

  const { showModal, hideModal } = useModal()
  const toggleWallet = useWalletModalToggle()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const [isExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient } = useSwapState()

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    selectedTokenIds
  } = useDerivedSwapInfo()
  const { [Field.INPUT]: fromAsset, [Field.OUTPUT]: toAsset } = currencies
  console.log('🚀 ~ file: index.tsx:84 ~ Swap ~ currencies:', currencies)

  const [fromErc721SubTokens, setFromErc721SubTokens] = useState<Token721[] | null>(null)
  const [toErc721SubTokens, setToErc721SubTokens] = useState<Token721[] | null>(null)

  const trade = v2Trade

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
  }

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]:
      // showWrap
      // ? parsedAmounts[independentField]?.toExact() ?? ''
      //   :
      parsedAmounts[dependentField]?.toSignificant(6, undefined, 0) ?? ''
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

  const [approval, approveCallback] = useAllTokenApproveCallback(
    fromAsset,
    slippageAdjustedAmounts[Field.INPUT],
    checkIs721(toAsset)
  )
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

  const { onSubTokenSelection, resetSubTokenSelection, tokenIds: tokenIds721 } = useSwap721State()
  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    selectedTokenIds
  )
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
        setFromErc721SubTokens(null)
        setToErc721SubTokens(null)
        resetSubTokenSelection(Field.INPUT)
        resetSubTokenSelection(Field.OUTPUT)
      })
      .catch(error => {
        hideModal()
        showModal(<MessageBox type="error">{replaceErrorMessage(error.message)}</MessageBox>)
        setSwapState(prev => ({
          ...prev,
          attemptingTxn: false,
          txHash: undefined
        }))
      })
  }, [hideModal, priceImpactWithoutFee, resetSubTokenSelection, showModal, swapCallback])

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
      (approvalSubmitted && approval === ApprovalState.APPROVED))
  // &&
  // !(priceImpactSeverity > 3 && !isExpertMode)

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
      console.log('currency=>', currency)

      resetSubTokenSelection(Field.INPUT)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currency)
      setFromErc721SubTokens(null)
      navigate(routes.swap + liquidityParamBuilder(currency, toAsset ?? undefined), { replace: false })
    },
    [navigate, onCurrencySelection, resetSubTokenSelection, toAsset]
  )

  const handleToAsset = useCallback(
    (currency: AllTokens) => {
      resetSubTokenSelection(Field.OUTPUT)
      onCurrencySelection(Field.OUTPUT, currency)
      setToErc721SubTokens(null)
      navigate(routes.swap + liquidityParamBuilder(fromAsset ?? undefined, currency), { replace: false })
    },
    [fromAsset, navigate, onCurrencySelection, resetSubTokenSelection]
  )

  const handleFromSubAssets = useCallback((tokens: Token721[]) => {
    setFromErc721SubTokens(tokens)
  }, [])

  const handleToSubAssets = useCallback((tokens: Token721[]) => {
    setToErc721SubTokens(tokens)
  }, [])

  const pair721Address = useMemo(() => {
    const tokenFrom = wrappedCurrency(fromAsset, chainId)
    const tokenTo = wrappedCurrency(toAsset, chainId)
    return tokenFrom && tokenTo && checkIs721(toAsset) ? Pair.getAddress(tokenFrom, tokenTo) : undefined
  }, [chainId, fromAsset, toAsset])

  //price correct function
  const { [Field.INPUT]: PriceCorrectInput, [Field.OUTPUT]: PriceCorrectOutput } = usePriceCorrection(
    v2Trade?.inputAmount,
    v2Trade?.outputAmount,
    independentField,
    currencies,
    handleFromVal,
    handleToVal,
    !!trade
  )

  const error = useMemo(() => {
    if (!fromAsset || !toAsset) {
      return 'Select a Token'
    }

    if (checkIs721(fromAsset) && checkIs721(toAsset)) {
      return 'Invalid Pair'
    }

    return undefined
  }, [fromAsset, toAsset])

  const onSwitch = useCallback(() => {
    if (!account) {
      return
    }
    onSwitchTokens()
    const from = fromErc721SubTokens
    const to = toErc721SubTokens
    setFromErc721SubTokens(to)
    setToErc721SubTokens(from)
  }, [account, onSwitchTokens, fromErc721SubTokens, toErc721SubTokens])

  useEffect(() => {
    if (fromAsset && checkIs721(fromAsset) && fromErc721SubTokens) {
      const ids: any[] = fromErc721SubTokens.map(({ tokenId }) => tokenId).filter(id => id !== undefined)
      onSubTokenSelection(Field.INPUT, fromAsset, ids)
    } else {
      resetSubTokenSelection(Field.INPUT)
    }
  }, [fromAsset, fromErc721SubTokens, onSubTokenSelection, resetSubTokenSelection])

  useEffect(() => {
    if (toAsset && checkIs721(toAsset)) {
      if (toErc721SubTokens) {
        const ids: any[] = toErc721SubTokens.map(({ tokenId }) => tokenId).filter(id => id !== undefined)
        onSubTokenSelection(Field.OUTPUT, toAsset, ids)
      } else {
        onSubTokenSelection(Field.OUTPUT, toAsset, [])
      }
    } else {
      resetSubTokenSelection(Field.OUTPUT)
    }
  }, [onSubTokenSelection, resetSubTokenSelection, toAsset, toErc721SubTokens])

  useEffect(() => {
    if (currency0) {
      if (currency0.symbol === 'WETH' || currency0.symbol === 'WBNB' || currency0.symbol === 'WMATIC') {
        onCurrencySelection(Field.INPUT, ETHER)
      } else {
        onCurrencySelection(Field.INPUT, currency0)
      }
    }
    if (currency1) {
      if (currency1.symbol === 'WETH' || currency1.symbol === 'WBNB' || currency1.symbol === 'WMATIC') {
        onCurrencySelection(Field.OUTPUT, ETHER)
      } else {
        onCurrencySelection(Field.OUTPUT, currency1)
      }
    }
    return
  }, [currency0, currency1, onCurrencySelection])

  useEffect(() => {
    if (checkIs721(toAsset) && !formattedAmounts[Field.OUTPUT]) {
      onUserInput(Field.OUTPUT, '1')
    }
    if (checkIs1155(toAsset) && !formattedAmounts[Field.OUTPUT]) {
      onUserInput(Field.OUTPUT, '1')
    }
    if (checkIs1155(fromAsset) && !formattedAmounts[Field.INPUT]) {
      onUserInput(Field.INPUT, '1')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAsset, fromAsset])

  useEffect(() => {
    if (checkIs721(fromAsset) && !tokenIds721[Field.INPUT]?.length) {
      onUserInput(Field.INPUT, '')
    }
    if (checkIs721(fromAsset) && tokenIds721[Field.INPUT]?.length) {
      const num = `${tokenIds721[Field.INPUT]?.length ?? ''}`
      onUserInput(Field.INPUT, num)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAsset, typedValue])

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
        tokenIds={selectedTokenIds}
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
            <>
              <CurrencyInputPanel
                value={formattedAmounts[Field.INPUT]}
                onChange={handleFromVal}
                onSelectCurrency={handleFromAsset}
                currency={fromAsset}
                onMax={handleMaxInput}
                disabled={!account}
                onSelectSubTokens={handleFromSubAssets}
                currencyA={fromAsset}
                currencyB={toAsset}
              />
              {PriceCorrectInput}
            </>
          </Box>
          <Box
            sx={{
              paddingBottom: 12,
              margin: '16px auto 32px',
              width: 'max-content',
              '&:hover': {
                opacity: 0.8
              },
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-start'
              }
            }}
          >
            <SwitchCircle onClick={onSwitch} style={{ cursor: account ? 'pointer' : 'auto' }} />
          </Box>
          <Box mb={toAsset ? 16 : 0}>
            <>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onChange={handleToVal}
                onSelectCurrency={handleToAsset}
                currency={toAsset}
                disabled={!account}
                onSelectSubTokens={handleToSubAssets}
                enableAuto={true}
                pairAddress={pair721Address}
                currencyA={fromAsset}
                currencyB={toAsset}
              />
              {PriceCorrectOutput}
            </>
          </Box>
          {/* {toAsset && <AssetAccordion token={toAsset} />} */}
          {isValid && !swapCallbackError && (
            <SwapSummary
              fromAsset={fromAsset ?? undefined}
              toAsset={toAsset ?? undefined}
              toVal={formattedAmounts[Field.OUTPUT]}
              price={v2Trade?.executionPrice?.toFixed(6) ?? '-'}
              expanded={summaryExpanded}
              onChange={() => setSummaryExpanded(!summaryExpanded)}
              margin="20px 0 0"
              gasFee="--"
              slippage={+(priceImpactWithoutFee?.toFixed(2) ?? 0)}
              minReceiveQty={slippageAdjustedAmounts.OUTPUT?.toFixed(6) ?? '-'}
              routerTokens={trade?.route.path.slice(1, -1)}
            />
          )}
          <Box mt={40}>
            {!account ? (
              <Button onClick={toggleWallet}>Connect Wallet</Button>
            ) : // : showWrap ? (
            // <Button disabled={Boolean(wrapInputError)} onClick={onWrap}>
            //   {wrapInputError ??
            //     (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
            // </Button>
            // )
            noRoute && userHasSpecifiedInputOutput ? (
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
                  height="60px"
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
                    // (priceImpactSeverity > 3 && !isExpertMode) ||
                    !!swapCallbackError ||
                    (showApproveFlow && approval !== ApprovalState.APPROVED)
                  }
                  error={
                    swapInputError
                      ? swapInputError
                      : // : priceImpactSeverity > 3 && !isExpertMode
                        // ? `Price Impact Too High`
                        undefined
                  }
                />
                <Typography
                  textAlign={'right'}
                  fontSize={12}
                  sx={{
                    mt: -10,
                    color: theme => theme.palette.text.secondary
                  }}
                >
                  Click the button on the right top to modify transaction settings.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </AppBody>
      {(fromAsset || toAsset) && (
        <TokenInfo
          fromAsset={fromAsset}
          toAsset={toAsset}
          fromErc721SubTokens={fromErc721SubTokens}
          toErc721SubTokens={toErc721SubTokens}
        />
      )}
    </>
  )
}

function TokenInfo({
  fromAsset,
  toAsset,
  fromErc721SubTokens,
  toErc721SubTokens
}: {
  fromAsset?: Currency
  toAsset?: Currency
  fromErc721SubTokens?: Token721[] | null
  toErc721SubTokens?: Token721[] | null
}) {
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
          {fromAsset && <AssetAccordion token={fromAsset} subTokens={fromErc721SubTokens} />}
          {toAsset && <AssetAccordion token={toAsset} subTokens={toErc721SubTokens} />}
        </Box>
      </Box>
    </AppBody>
  )
}
