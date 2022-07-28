import { useCallback, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { Typography, Box, useTheme, Button } from '@mui/material'
import { TokenAmount } from '@uniswap/sdk'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import { AssetAccordion } from '../Swap/AssetAccordion'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { AllTokens } from 'models/allTokens'
import { useIsExpertMode } from 'state/user/hooks'
import { Field } from 'state/mint/actions'
import { ApprovalState, useAllTokenApproveCallback } from 'hooks/useApproveCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import Card from 'components/Card'
// import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
// import useModal from 'hooks/useModal'
import ConfirmSupplyModal from 'components/Modal/ConfirmSupplyModal'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import { usePoolCallback } from 'hooks/usePoolCallback'
import { checkIs1155 } from 'utils/checkIs1155'
import { ONE_BIPS } from 'constants/index'
import { PairState } from 'data/Reserves'

export default function AddLiquidy() {
  const [currencyA, setCurrencyA] = useState<undefined | AllTokens>(undefined)
  const [currencyB, setCurrencyB] = useState<undefined | AllTokens>(undefined)

  const { account } = useActiveWeb3React()
  const navigate = useNavigate()
  // const { showModal } = useModal()
  const toggleWallet = useWalletModalToggle()
  const expertMode = useIsExpertMode()
  const { addLiquidityCb } = usePoolCallback(currencyA, currencyB)

  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    // pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    // liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA, currencyB)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  // txn values

  // const [txHash, setTxHash] = useState<string>('')

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
  const [approvalA, approveACallback] = useAllTokenApproveCallback(currencyA, parsedAmounts[Field.CURRENCY_A])
  const [approvalB, approveBCallback] = useAllTokenApproveCallback(currencyB, parsedAmounts[Field.CURRENCY_B])

  const handleMaxInputA = useCallback(() => {
    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
  }, [maxAmounts, onFieldAInput])

  const handleMaxInputB = useCallback(() => {
    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
  }, [maxAmounts, onFieldBInput])

  const handleAdd = useCallback(() => {
    expertMode ? addLiquidityCb() : setShowConfirm(true)
  }, [addLiquidityCb, expertMode])

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

  const handleAssetA = useCallback((currency: AllTokens) => {
    setCurrencyA(currency)
  }, [])

  const handleAssetB = useCallback((currency: AllTokens) => {
    setCurrencyB(currency)
  }, [])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    // if (txHash) {
    //   onFieldAInput('')
    // }
    // setTxHash('')
  }, [])

  return (
    <>
      <ConfirmSupplyModal
        onConfirm={addLiquidityCb}
        from={currencyA}
        to={currencyB}
        fromVal={formattedAmounts[Field.CURRENCY_A]}
        toVal={formattedAmounts[Field.CURRENCY_B]}
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
      />

      <AppBody
        width={'100%'}
        maxWidth={'680px'}
        onReturnClick={() => navigate(routes.pool)}
        title="Add Liquidity"
        sx={{ padding: '24px 32px' }}
        setting
      >
        <Box mt={35}>
          <Tips />
          <Box mb={currencyA ? 16 : 0}>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onChange={handleAssetAVal}
              onSelectCurrency={handleAssetA}
              currency={currencyA}
              onMax={handleMaxInputA}
            />
          </Box>
          {currencyA && <AssetAccordion token={currencyA} />}
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box mb={currencyB ? 16 : 0}>
            <CurrencyInputPanel
              selectedTokenType={currencyA ? (checkIs1155(currencyA) ? 'erc1155' : 'erc20') : undefined}
              value={formattedAmounts[Field.CURRENCY_B]}
              onChange={handleAssetBVal}
              onSelectCurrency={handleAssetB}
              currency={currencyB}
              onMax={handleMaxInputB}
            />
          </Box>
          {currencyB && <AssetAccordion token={currencyB} />}

          {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
            <>
              <PriceAndPoolShare
                data={{
                  [`${currencyA?.name} per ${currencyB?.name}`]: '2344887737787377',
                  [`${currencyB?.name} per ${currencyA?.name}`]: '0.2344887737787377',
                  ['Share of pool']: ` ${
                    noLiquidity && price
                      ? '100'
                      : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
                  }
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
                  isValid && (
                    <Box display="flex" gap={16}>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ActionButton
                          onAction={approveACallback}
                          disableAction={approvalA === ApprovalState.PENDING}
                          pending={approvalA === ApprovalState.PENDING}
                          pendingText={`Approving ${currencies[Field.CURRENCY_A]?.symbol}`}
                          actionText={'Approve ' + currencies[Field.CURRENCY_A]?.symbol}
                        />
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <ActionButton
                          onAction={approveBCallback}
                          disableAction={approvalB === ApprovalState.PENDING}
                          pending={approvalB === ApprovalState.PENDING}
                          pendingText={`Approving ${currencies[Field.CURRENCY_B]?.symbol}`}
                          actionText={'Approve ' + currencies[Field.CURRENCY_B]?.symbol}
                        />
                      )}
                    </Box>
                  )}
                <Button
                  onClick={handleAdd}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                >
                  {error ?? 'Supply'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </AppBody>
    </>
  )
}

function Tips() {
  const theme = useTheme()

  return (
    <Box
      sx={{ width: '100%', background: theme.gradient.gradient3, padding: '16px 20px', borderRadius: '8px', mb: 20 }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
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
