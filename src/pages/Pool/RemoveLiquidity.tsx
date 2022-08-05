import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TransactionResponse } from '@ethersproject/providers'
import { currencyEquals, Percent, WETH } from '@uniswap/sdk'
import { Box, useTheme, Typography, Button, Slider, styled, ButtonBase } from '@mui/material'
import { liquidityParamBuilder, routes } from 'constants/routes'
import AppBody from 'components/AppBody'
import Card from 'components/Card'
import { ETHER } from 'constants/token'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import { ReactComponent as AddCircle } from 'assets/svg/add_circle.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import PositionCard from './PositionCard'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn/hooks'
import { Field } from 'state/burn/actions'
import { ApprovalState } from 'hooks/useApproveCallback'
import { useBurnCallback } from 'hooks/usePoolCallback'
import { useTransactionAdder } from 'state/transactions/hooks'
import useDebouncedChangeHandler from 'utils/useDebouncedChangeHandler'
import ActionButton from 'components/Button/ActionButton'
import ConfirmRemoveModal from 'components/Modal/ConfirmRemoveModal'
import { useCurrencyBalance, useTokenTotalSupply } from 'state/wallet/hooks'
import { getTokenText } from 'utils/checkIs1155'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { generateErc20 } from 'utils/getHashAddress'
import { wrappedCurrency } from 'utils/wrappedCurrency'

enum Mode {
  SIMPLE,
  DETAIL
}

export default function RemoveLiquidity() {
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [mode, setMode] = useState(Mode.DETAIL)

  const navigate = useNavigate()
  const theme = useTheme()
  const { showModal, hideModal } = useModal()
  const { currencyIdA, currencyIdB, tokenIds } = useParams()
  const [tokenIdA, tokenIdB] = tokenIds?.split('&') ?? ['', '']

  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA, tokenIdA) ?? undefined,
    useCurrency(currencyIdB, tokenIdB) ?? undefined
  ]
  const { Token1Text, Token2Text } = getTokenText(currencyA, currencyB)
  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const { burnCallback, burnApproveCallback, setSignatureData, approval, signatureData } = useBurnCallback(
    currencyA,
    currencyB
  )
  const balance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken)
  const totalSupply = useTokenTotalSupply(pair?.liquidityToken)
  const isValid = !error

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      (independentField as Field) === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''
  }

  const poolTokenPercentage = totalSupply && balance ? new Percent(balance.raw, totalSupply.raw).toFixed() + '%' : '-'

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null)

      return _onUserInput(field, typedValue)
    },
    [_onUserInput, setSignatureData]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  const handleRemove = useCallback(() => {
    setShowConfirm(false)
    showModal(<TransacitonPendingModal />)
    burnCallback()
      ?.then((response: TransactionResponse) => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
        addTransaction(response, {
          summary:
            'Remove ' +
            parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
            ' ' +
            currencyA?.symbol +
            ' and ' +
            parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
            ' ' +
            currencyB?.symbol
        })
        onUserInput(Field.LIQUIDITY_PERCENT, '0')
      })
      .catch((error: Error) => {
        hideModal()
        showModal(<MessageBox type="error">{error.message}</MessageBox>)
        // we only care if the error is something _other_ than the user rejected the tx
        console.error(error)
      })
  }, [
    addTransaction,
    burnCallback,
    currencyA?.symbol,
    currencyB?.symbol,
    hideModal,
    onUserInput,
    parsedAmounts,
    showModal
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
  }, [setSignatureData])

  // const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
  //   currencyA?.symbol
  // } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )
  const [innterLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)) as any,
    liquidityPercentChangeCallback
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  )

  const handleMode = useCallback(() => {
    setMode(prev => (prev === Mode.DETAIL ? Mode.SIMPLE : Mode.DETAIL))
  }, [])

  const assets = useMemo(() => {
    return pair?.token0.address === ((generateErc20(wrappedCurrency(currencyA, chainId)) as any)?.address ?? '')
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
  }, [currencyA, currencyB, pair?.token0.address, chainId])

  return (
    <>
      <ConfirmRemoveModal
        isOpen={showConfirm}
        onConfirm={handleRemove}
        onDismiss={handleDismissConfirmation}
        val={formattedAmounts[Field.LIQUIDITY]}
        priceA={pair?.token0Price?.toFixed() ?? '-'}
        priceB={pair?.token1Price?.toFixed() ?? '-'}
        tokenA={currencyA}
        tokenB={currencyB}
        valA={formattedAmounts[Field.CURRENCY_A]}
        valB={formattedAmounts[Field.CURRENCY_B]}
      />
      <AppBody
        width={'100%'}
        maxWidth={'680px'}
        onReturnClick={() => navigate(routes.pool)}
        title="Remove Liquidity"
        sx={{ padding: '24px 32px' }}
        setting
      >
        <Tips />

        <NumericalCard
          mode={mode}
          onChangeMode={handleMode}
          sliderValue={innterLiquidityPercentage}
          onSliderChange={setInnerLiquidityPercentage}
        />

        {mode === Mode.SIMPLE && (
          <>
            <Box>
              <Box gap="10px">
                <Box display="flex">
                  {formattedAmounts[Field.CURRENCY_A] || '-'}

                  <Box>
                    <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                    {currencyA?.symbol}
                  </Box>
                </Box>
                <Box>
                  {formattedAmounts[Field.CURRENCY_B] || '-'}
                  <Box display="flex">
                    <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                    {currencyB?.symbol}
                  </Box>
                </Box>
                {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                  <Box style={{ justifyContent: 'flex-end' }}>
                    {oneCurrencyIsETH ? (
                      <Box
                        onClick={() => {
                          navigate(
                            routes.removeLiquidity +
                              liquidityParamBuilder(
                                currencyA === ETHER ? WETH[chainId] : currencyB,
                                currencyB === ETHER ? WETH[chainId] : currencyB
                              )
                          )
                        }}
                      >
                        Receive WETH
                      </Box>
                    ) : oneCurrencyIsWETH ? (
                      <Box
                        onClick={() => {
                          navigate(routes.removeLiquidity + liquidityParamBuilder(currencyA, currencyB))
                        }}
                      >
                        Receive ETH
                      </Box>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Box>
          </>
        )}
        <InputCard
          value={formattedAmounts[Field.LIQUIDITY]}
          balance={balance?.toExact() ?? ''}
          currency0={currencyA}
          currency1={currencyB}
        />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <ArrowCircle />
        </Box>
        <OutputCard value={formattedAmounts[Field.CURRENCY_A]} currency={currencyA} />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <AddCircle />
        </Box>

        <OutputCard value={formattedAmounts[Field.CURRENCY_B]} currency={currencyB} />
        <Box display="flex" justifyContent="space-between" mt={36} mb={52}>
          <Typography sx={{ fontSize: 18 }}>Price</Typography>
          <Box display="grid" gap={12}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 <Token1Text fontSize={18} /> = {pair?.token0Price?.toFixed()} <Token2Text fontSize={18} />
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 <Token2Text fontSize={18} /> = {pair?.token1Price?.toFixed() ?? '-'} <Token1Text fontSize={18} />
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={8}>
          {!account ? (
            <Button onClick={toggleWalletModal}>Connect Wallet</Button>
          ) : (
            <>
              <ActionButton
                onAction={burnApproveCallback}
                disableAction={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                pending={approval === ApprovalState.PENDING}
                success={approval === ApprovalState.APPROVED || signatureData !== null}
                pendingText={'Approving'}
                successText="Approved"
                actionText="Approve"
              />
              <Button
                onClick={() => {
                  setShowConfirm(true)
                }}
                disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
              >
                {error || 'Remove'}
              </Button>
            </>
          )}
        </Box>
      </AppBody>
      <Box maxWidth={680} width="100%" mt={30}>
        <PositionCard
          assetA={assets[0]}
          assetB={assets[1]}
          lpBalance={balance?.toExact()}
          liquidityA={pair?.reserve0.toExact()}
          liquidityB={pair?.reserve1.toExact()}
          poolShare={poolTokenPercentage}
        />
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
        background: theme.palette.background.default,
        padding: '16px 20px',
        borderRadius: '8px',
        mb: 20,
        mt: 24
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: theme.palette.text.secondary }}>
        Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically
        earn fees proportional to your share of the pool, and can be redeemed at any time.
      </Typography>
    </Box>
  )
}

function NumericalCard({
  mode,
  onChangeMode,
  sliderValue,
  onSliderChange
}: {
  mode: Mode
  onChangeMode: () => void
  sliderValue: number
  onSliderChange: (val: number) => void
}) {
  const theme = useTheme()

  const onChange = useCallback(
    (e: Event) => {
      const val = (e.target as any)?.value
      onSliderChange(val ? parseInt(val) : 0)
    },
    [onSliderChange]
  )

  const onChangeFactory = useCallback(
    (val: number) => () => {
      onSliderChange(val)
    },
    [onSliderChange]
  )

  return (
    <Card color={theme.palette.background.default} padding="24px 20px" style={{ position: 'relative' }}>
      <Box display="grid" gap={15}>
        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Remove Amount</Typography>
        <Typography sx={{ fontSize: 40, fontWeight: 900 }}>{sliderValue}%</Typography>
      </Box>
      {mode === Mode.DETAIL && <StyledSlider onChange={onChange} value={sliderValue} />}
      <Box display="flex" gap={24} justifyContent="center">
        <Option onClick={onChangeFactory(25)}>25%</Option>
        <Option onClick={onChangeFactory(50)}>50%</Option>
        <Option onClick={onChangeFactory(75)}>75%</Option>
        <Option onClick={onChangeFactory(100)}>MAX</Option>
      </Box>
      <Box
        sx={{
          width: 103,
          height: 41,
          borderRadius: '12px',
          background: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 16,
          right: 20
        }}
      >
        <Typography sx={{ color: theme.palette.text.secondary }} onClick={onChangeMode}>
          {mode === Mode.SIMPLE ? 'Simple' : 'Detailed'}
        </Typography>
      </Box>
    </Card>
  )
}

function InputCard({
  value,
  balance,
  currency0,
  currency1
}: {
  value: string
  balance: string
  currency0: AllTokens | undefined
  currency1: AllTokens | undefined
}) {
  const theme = useTheme()
  const { token1Text, token2Text, token1Is1155 } = getTokenText(currency0, currency1)

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Input</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value ? value : '0'}</Typography>
        </Box>
        <Box display="grid" gap={14}>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>Balance: {balance ?? '-'}</Typography>
          <Box display="flex" gap={11} alignItems="center">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
            <Typography>
              <Typography component="span" color={token1Is1155 ? 'primary' : undefined}>
                {token1Text}
              </Typography>
              :
              <Typography component="span" color={token1Is1155 ? undefined : 'primary'}>
                {token2Text}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

function OutputCard({ value, currency }: { value: string; currency: AllTokens | undefined }) {
  const theme = useTheme()

  const { token1Text } = getTokenText(currency)

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Output</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value}</Typography>
        </Box>
        <Box display="flex" gap={12} width={180} alignItems="center">
          {currency && <CurrencyLogo currency={currency} />}
          <Typography>{token1Text}</Typography>
        </Box>
      </Box>
    </Card>
  )
}

const StyledSlider = styled(Slider)({
  // color: 'linear-gradient(19.49deg, #CAF400 -1.57%, #00E4DD 88.47%)',
  height: 4,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'black',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
})

const Option = styled(ButtonBase)(({ theme }) => ({
  width: 76,
  height: 41,
  background: theme.palette.background.paper,
  borderRadius: '12px',
  color: theme.palette.text.secondary,
  fontSize: 14
}))
