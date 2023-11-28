import { useCallback, useState, ChangeEvent, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Typography, Box, useTheme, Button } from '@mui/material'
import { Token, TokenAmount } from '@ladder/sdk'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as AddCircle } from 'assets/svg/add_circle.svg'
import { AssetAccordion } from '../Swap/AssetAccordion'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
// import { AllTokens } from 'models/allTokens'
import { useIsExpertMode } from 'state/user/hooks'
import { Field } from 'state/mint/actions'
import { ApprovalState, useAllTokenApproveCallback } from 'hooks/useApproveCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import Card from 'components/Card'
import useModal from 'hooks/useModal'
import ConfirmSupplyModal from 'components/Modal/ConfirmSupplyModal'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import { useMintCallback } from 'hooks/usePoolCallback'
import { ONE_BIPS } from 'constants/index'
import { PairState } from 'data/Reserves'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useTransactionAdder } from 'state/transactions/hooks'
// import { useCurrency } from 'hooks/Tokens'
import { getSymbol } from 'utils/getSymbol'
import { checkIs721, getTokenText } from 'utils/checkIs1155'
import { Token721 } from 'constants/token/token721'
import { generateErc20 } from 'utils/getHashAddress'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import usePriceCorrection from 'hooks/usePriceCorrection'
import { replaceErrorMessage } from 'utils'
import useBreakpoint from 'hooks/useBreakpoint'
import { ActivityInfo } from 'pages/Swap'

export const [currencyA, currencyB] = [
  new Token(137, '0x0000000000000000000000000000000000001010', 18, 'MATIC', 'Matic Token'),
  new Token721(137, '0x9E8Ea82e76262E957D4cC24e04857A34B0D8f062', undefined, {
    name: 'Drago',
    tokenUri: 'https://api.fansi.me/NFT/biopunk/',
    symbol: 'DRG',
    uri: 'https://fansi-static.s3.ap-southeast-1.amazonaws.com/MetaBoom/NFT/GENI/MetaBoom-KEE91AGA7C.png'
  })
]

export default function AddLiquidy() {
  const isDownSm = useBreakpoint('sm')
  // const [currencyA, setCurrencyA] = useState<undefined | AllTokens>(undefined)
  // const [currencyB, setCurrencyB] = useState<undefined | AllTokens>(undefined)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  // const { currencyIdA, currencyIdB, tokenIds } = useParams()
  // const [tokenIdA, tokenIdB] = tokenIds?.split(liquidityParamSplitter) ?? ['', '']
  // const [currency0, currency1] = [
  //   useCurrency(currencyIdA, tokenIdA) ?? undefined,
  //   useCurrency(currencyIdB, tokenIdB) ?? undefined
  // ]

  const { account, chainId } = useActiveWeb3React()
  const navigate = useNavigate()
  const { showModal, hideModal } = useModal()
  const toggleWallet = useWalletModalToggle()
  const expertMode = useIsExpertMode()
  const addTransaction = useTransactionAdder()

  const { addLiquidityCb } = useMintCallback(currencyA, currencyB)
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA, currencyB)
  const { onFieldAInput, onFieldBInput, onSetTokenIds, onResetMintState } = useMintActionHandlers(noLiquidity)
  const shareOfPool =
    noLiquidity && price
      ? '100'
      : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useAllTokenApproveCallback(
    currencyA,
    parsedAmounts[Field.CURRENCY_A],
    checkIs721(currencyB)
  )
  const [approvalB, approveBCallback] = useAllTokenApproveCallback(
    currencyB,
    parsedAmounts[Field.CURRENCY_B],
    checkIs721(currencyA)
  )

  const handleMaxInputA = useCallback(() => {
    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toFixed(6, undefined, 0) ?? '')
  }, [maxAmounts, onFieldAInput])

  const handleMaxInputB = useCallback(() => {
    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toFixed(6, undefined, 0) ?? '')
  }, [maxAmounts, onFieldBInput])

  const handleAddCb = useCallback(() => {
    setShowConfirm(false)
    showModal(<TransacitonPendingModal />)
    onFieldAInput('')
    onSetTokenIds([])
    addLiquidityCb()
      .then(response => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
        if (!response) return
        addTransaction(response, {
          summary:
            'Add ' +
            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
            ' ' +
            getSymbol(currencies[Field.CURRENCY_A], chainId) +
            ' and ' +
            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
            ' ' +
            getSymbol(currencies[Field.CURRENCY_B], chainId)
        })
      })
      .catch(error => {
        hideModal()
        // error than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
          showModal(
            <MessageBox type="error">
              {error?.message ? replaceErrorMessage(error.message) : 'Contract Error'}
            </MessageBox>
          )
        }
      })
  }, [
    addLiquidityCb,
    addTransaction,
    chainId,
    currencies,
    hideModal,
    onFieldAInput,
    onSetTokenIds,
    parsedAmounts,
    showModal
  ])

  const handleAdd = useCallback(() => {
    expertMode ? handleAddCb() : setShowConfirm(true)
  }, [expertMode, handleAddCb])

  const handleAssetAVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFieldAInput(e.target.value)
    },
    [onFieldAInput]
  )

  const handleAssetBVal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFieldBInput(e.target.value)
    },
    [onFieldBInput]
  )

  // const handleAssetA = useCallback((currency: AllTokens) => {
  //   setCurrencyA(currency)
  // }, [])

  // const handleAssetB = useCallback((currency: AllTokens) => {
  //   setCurrencyB(currency)
  // }, [])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
  }, [])

  // useEffect(() => {
  //   if (currency0) {
  //     if (currency0.symbol === 'WETH' || currency0.symbol === 'WBNB' || currency0.symbol === 'WMATIC') {
  //       setCurrencyA(ETHER)
  //     } else {
  //       setCurrencyA(currency0)
  //     }
  //   }
  //   if (currency1) {
  //     if (currency1.symbol === 'WETH' || currency1.symbol === 'WBNB' || currency1.symbol === 'WMATIC') {
  //       setCurrencyB(ETHER)
  //     } else {
  //       setCurrencyB(currency1)
  //     }
  //   }
  //   return
  // }, [currency0, currency1])

  useEffect(() => {
    return onResetMintState
  }, [onResetMintState])

  const handleTokenIds = useCallback(
    (tokens: Token721[]) => {
      const list = tokens.map(({ tokenId }) => tokenId)
      onSetTokenIds(list as any[])
    },
    [onSetTokenIds]
  )
  const flipOrder =
    pair?.token0.address === ((generateErc20(wrappedCurrency(currencyA, chainId)) as any)?.address ?? '')

  const assets = useMemo(() => {
    return flipOrder ? [currencyA, currencyB] : [currencyB, currencyA]
  }, [flipOrder])

  const assetsTexts = getTokenText(assets[0], assets[1])

  const priceA = pair?.token0Price.equalTo('0')
    ? '0'
    : pair?.token0Price?.toFixed(6, undefined, 2).trimTrailingZero() ?? '-'
  const priceB = pair?.token1Price.equalTo('0')
    ? '0'
    : pair?.token1Price?.toFixed(6, undefined, 2).trimTrailingZero() ?? '-'

  //price correct function
  const { [Field.CURRENCY_A]: PriceCorrectA, [Field.CURRENCY_B]: PriceCorrectB } = usePriceCorrection(
    parsedAmounts[Field.CURRENCY_A],
    parsedAmounts[Field.CURRENCY_B],
    independentField,
    currencies,
    handleAssetAVal,
    handleAssetBVal,
    !!pair
  )

  return (
    <>
      <ConfirmSupplyModal
        liquidityMinted={liquidityMinted}
        onConfirm={handleAddCb}
        tokenA={currencyA}
        tokenB={currencyB}
        priceA={flipOrder ? priceA : priceB}
        priceB={flipOrder ? priceB : priceA}
        valA={formattedAmounts[Field.CURRENCY_A]}
        valB={formattedAmounts[Field.CURRENCY_B]}
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        shareOfPool={shareOfPool}
      />
      <Box display={{ xs: 'grid', md: 'flex' }} gap={{ xs: 20, md: 54 }} maxWidth={isDownSm ? '90vw' : 'auto'}>
        <Box>
          <AppBody
            width={'100%'}
            maxWidth={'680px'}
            onReturnClick={() => navigate(routes.pool)}
            title="Add Liquidity"
            sx={{ padding: { xs: '20px', md: '24px 32px' } }}
            setting
          >
            <Box mt={35}>
              <Tips />
              <Box mb={currencyA ? 16 : 0}>
                <>
                  <CurrencyInputPanel
                    disableCurrencySelect
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onChange={handleAssetAVal}
                    currency={currencyA}
                    onMax={handleMaxInputA}
                    onSelectSubTokens={handleTokenIds}
                  />
                  {PriceCorrectA}
                </>
              </Box>
              {currencyA && <AssetAccordion token={currencyA} />}
              <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddCircle />
              </Box>

              <Box mb={currencyB ? 16 : 0} mt={16}>
                <>
                  <CurrencyInputPanel
                    disableCurrencySelect
                    // selectedTokenType={currencyA ? (checkIs1155(currencyA) ? 'erc1155' : 'erc20') : undefined}
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onChange={handleAssetBVal}
                    currency={currencyB}
                    onMax={handleMaxInputB}
                    onSelectSubTokens={handleTokenIds}
                  />
                  {PriceCorrectB}
                </>
              </Box>
              {currencyB && <AssetAccordion token={currencyB} />}

              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <>
                  <PriceAndPoolShare
                    data={{
                      [`${assetsTexts.token2Text} per ${assetsTexts.token1Text}`]: priceA ?? '-',
                      [`${assetsTexts.token1Text} per ${assetsTexts.token2Text}`]: priceB ?? '-',
                      ['Share of pool']: `${shareOfPool}
                      %`
                    }}
                  />
                </>
              )}
              <Box mt={40}>
                {!account ? (
                  <Button onClick={toggleWallet}>Connect Wallet</Button>
                ) : (
                  <Box display="grid" gap={'16px'}>
                    {(approvalA === ApprovalState.NOT_APPROVED ||
                      approvalA === ApprovalState.PENDING ||
                      approvalB === ApprovalState.NOT_APPROVED ||
                      approvalB === ApprovalState.PENDING) &&
                      !error && (
                        <Box display="flex" gap={16}>
                          {approvalA !== ApprovalState.APPROVED && (
                            <ActionButton
                              onAction={approveACallback}
                              disableAction={approvalA === ApprovalState.PENDING}
                              pending={approvalA === ApprovalState.PENDING}
                              pendingText={`Approving ${
                                currencies[Field.CURRENCY_A]?.symbol ?? currencies[Field.CURRENCY_A]?.name
                              }`}
                              actionText={
                                'Approve ' +
                                (currencies[Field.CURRENCY_A]?.symbol ?? currencies[Field.CURRENCY_A]?.name)
                              }
                            />
                          )}
                          {approvalB !== ApprovalState.APPROVED && (
                            <ActionButton
                              onAction={approveBCallback}
                              disableAction={approvalB === ApprovalState.PENDING}
                              pending={approvalB === ApprovalState.PENDING}
                              pendingText={`Approving ${
                                currencies[Field.CURRENCY_B]?.symbol ?? currencies[Field.CURRENCY_B]?.name
                              }`}
                              actionText={
                                'Approve ' +
                                (currencies[Field.CURRENCY_B]?.symbol ?? currencies[Field.CURRENCY_B]?.name)
                              }
                            />
                          )}
                        </Box>
                      )}
                    <Button
                      onClick={handleAdd}
                      disabled={!!error || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    >
                      {error ?? 'Supply'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </AppBody>
          {currencyA && currencyB && (
            <Box maxWidth={'550px'} textAlign="center" mb={{ xs: 50, md: 100 }} padding={'0 20px'}>
              By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the
              pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
            </Box>
          )}
        </Box>
        <ActivityInfo />
      </Box>
    </>
  )
}

function Tips() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        background: theme.gradient.gradient3,
        padding: { xs: '16px 10px', md: '16px 20px' },
        borderRadius: '8px',
        mb: 20
      }}
    >
      <Typography sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 400 }}>
        Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically
        earn fees proportional to your share of the pool, and can be redeemed at any time.
      </Typography>
    </Box>
  )
}

function PriceAndPoolShare({ data }: { data: object }) {
  const theme = useTheme()

  return (
    <Card gray style={{ margin: '20px 0 0px', padding: '16px 20px' }}>
      <Typography sx={{ fontSize: 20, mb: 12 }} fontWeight={500}>
        Prices and pool share
      </Typography>
      <Box sx={{ display: 'grid', gap: 12 }}>
        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent="space-between">
            <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>{key}</Typography>
            <Typography sx={{ fontWeight: 700 }}>{data[key as keyof typeof data]}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
