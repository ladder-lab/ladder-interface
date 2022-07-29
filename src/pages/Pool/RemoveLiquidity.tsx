import { useState, useCallback, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TransactionResponse } from '@ethersproject/providers'
import { currencyEquals, Percent, WETH } from '@uniswap/sdk'
import { Box, useTheme, Typography, Button, Slider, styled, ButtonBase } from '@mui/material'
import { routes } from 'constants/routes'
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
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import useDebouncedChangeHandler from 'utils/useDebouncedChangeHandler'
import { currencyId } from 'utils/currencyId'
import ActionButton from 'components/Button/ActionButton'
import { Token1155 } from 'constants/token/token1155'

enum Mode {
  SIMPLE,
  DETAIL
}

export default function RemoveLiquidity() {
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [mode, setMode] = useState(Mode.DETAIL)

  const navigate = useNavigate()
  const theme = useTheme()
  const { currencyIdA, currencyIdB, tokenIds } = useParams()
  const [tokenIdA, tokenIdB] = tokenIds?.split('&') ?? ['', '']

  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA, tokenIdA) ?? undefined,
    useCurrency(currencyIdB, tokenIdB) ?? undefined
  ]

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const { burnCallback, burnApproveCallback, setSignatureData, approval, signatureData } = useBurnCallback(
    currencyA,
    currencyB
  )
  const isValid = !error

  // txn values
  const [txHash, setTxHash] = useState<string>('')

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

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null)

      return _onUserInput(field, typedValue)
    },
    [_onUserInput, setSignatureData]
  )

  const onLiquidityInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      onUserInput(Field.LIQUIDITY, e.target.value)
    },
    [onUserInput]
  )
  const onCurrencyAInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => onUserInput(Field.CURRENCY_A, e.target.value),
    [onUserInput]
  )
  const onCurrencyBInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => onUserInput(Field.CURRENCY_B, e.target.value),
    [onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  const handleRemove = useCallback(() => {
    burnCallback()
      ?.then((response: TransactionResponse) => {
        setAttemptingTxn(false)

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

        setTxHash(response.hash)
      })
      .catch((error: Error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        console.error(error)
      })
  }, [addTransaction, burnCallback, currencyA?.symbol, currencyB?.symbol, parsedAmounts])

  // const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
  //   currencyA?.symbol
  // } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencyB?.symbol}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB)))
  )

  const handleSelectCurrencyA = useCallback(
    (currency: AllTokens) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        const route =
          routes.removeLiquidity +
          `/${currencyId(currency)}/${currencyIdA}/${'tokenId' in currency ? currency.tokenId : ''}&${tokenIdA ?? ''}`

        navigate(route)
      } else {
        const route =
          routes.removeLiquidity +
          `/${currencyId(currency)}/${currencyIdB}/${'tokenId' in currency ? currency.tokenId : ''}&${tokenIdB ?? ''}`
        navigate(route)
      }
    },
    [currencyIdA, currencyIdB, navigate, tokenIdA, tokenIdB]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: AllTokens) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        navigate(
          routes.removeLiquidity +
            `/${currencyIdB}/${currencyId(currency)}/${tokenIdB}&${'tokenId' in currency ? currency.tokenId : ''}`
        )
      } else {
        navigate(
          routes.removeLiquidity +
            `/${currencyIdA}/${currencyId(currency)}/${tokenIdA}&${'tokenId' in currency ? currency.tokenId : ''}`
        )
      }
    },
    [currencyIdA, currencyIdB, navigate, tokenIdA, tokenIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )

  const handleMode = useCallback(() => {
    setMode(prev => (prev === Mode.DETAIL ? Mode.SIMPLE : Mode.DETAIL))
  }, [])

  return (
    <>
      <AppBody
        width={'100%'}
        maxWidth={'680px'}
        onReturnClick={() => navigate(routes.pool)}
        title="Remove Liquidity"
        sx={{ padding: '24px 32px' }}
        setting
      >
        <Tips />

        <NumericalCard mode={mode} onChangeMode={handleMode} />

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
                              `/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                                currencyB === ETHER ? WETH[chainId].address : currencyIdB
                              }/${currencyA && 'tokenId' in currencyA ? (currencyA as Token1155).tokenId : ''}&${
                                currencyB && 'tokenId' in currencyB ? (currencyB as Token1155).tokenId : ''
                              }`
                          )
                        }}
                      >
                        Receive WETH
                      </Box>
                    ) : oneCurrencyIsWETH ? (
                      <Box
                        onClick={() => {
                          navigate(
                            routes.removeLiquidity +
                              `/${currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA}/${
                                currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB
                              }/${currencyA && 'tokenId' in currencyA ? (currencyA as Token1155).tokenId : ''}&${
                                currencyB && 'tokenId' in currencyB ? (currencyB as Token1155).tokenId : ''
                              }`
                          )
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
        <CurrencyInputPanel
          value={formattedAmounts[Field.LIQUIDITY]}
          onMax={() => {
            onUserInput(Field.LIQUIDITY_PERCENT, '100')
          }}
          onChange={onLiquidityInput}
          disableCurrencySelect
          currency={pair?.liquidityToken}
        />
        <InputCard value="0.91234" balance="1234.45678" currency0={ETHER} currency1={ETHER} />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <ArrowCircle />
        </Box>
        <CurrencyInputPanel
          hideBalance={true}
          value={formattedAmounts[Field.CURRENCY_A]}
          onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
          onChange={onCurrencyAInput}
          onSelectCurrency={handleSelectCurrencyA}
          currency={currencyA}
        />
        <OutputCard value="0.91234" currency={ETHER} />
        <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {}}>
          <AddCircle />
        </Box>
        <CurrencyInputPanel
          hideBalance={true}
          value={formattedAmounts[Field.CURRENCY_B]}
          onChange={onCurrencyBInput}
          onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
          currency={currencyB}
          onSelectCurrency={handleSelectCurrencyB}
        />
        <OutputCard value="70" currency={ETHER} />
        <Box display="flex" justifyContent="space-between" mt={36} mb={52}>
          <Typography sx={{ fontSize: 18 }}>Price</Typography>
          <Box display="grid" gap={12}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 DAI = 0.02414876 Tickets for the com...
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 18 }}>
              1 Tickets for the com... = 4.1486 DAI
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
                // error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
              >
                {error || 'Remove'}
              </Button>
            </>
          )}
        </Box>
      </AppBody>
      <Box maxWidth={680} width="100%" mt={30}>
        <PositionCard from={ETHER} to={ETHER} />
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

function NumericalCard({ mode, onChangeMode }: { mode: Mode; onChangeMode: () => void }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px 20px" style={{ position: 'relative' }}>
      <Box display="grid" gap={15}>
        <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Remove Amount</Typography>
        <Typography sx={{ fontSize: 40, fontWeight: 900 }}>50%</Typography>
      </Box>
      {mode === Mode.DETAIL && <StyledSlider />}
      <Box display="flex" gap={24} justifyContent="center">
        <Option onClick={() => {}}>25%</Option>
        <Option onClick={() => {}}> 50%</Option>
        <Option onClick={() => {}}>75%</Option>
        <Option onClick={() => {}}>MAX</Option>
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
  currency0: AllTokens
  currency1: AllTokens
}) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Input</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value}</Typography>
        </Box>
        <Box display="grid" gap={14}>
          <Typography sx={{ fontSize: 16, fontWeight: 400 }}>Balance: {balance}</Typography>
          <Box display="flex" gap={11} alignItems="center">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
            <Typography>
              {currency0.symbol}: {currency1.symbol}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

function OutputCard({ value, currency }: { value: string; currency: AllTokens }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.default} padding="24px" style={{ marginTop: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="grid" gap={12}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>Output</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 900 }}>{value}</Typography>
        </Box>
        <Box display="flex" gap={12} width={180}>
          <CurrencyLogo currency={currency} />
          <Typography>{currency.symbol}</Typography>
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
