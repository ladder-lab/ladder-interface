import { Currency, CurrencyAmount } from '@ladder/sdk'
import { Box, Button, styled, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Field as SwapField } from 'state/swap/actions'
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'
import { Field as MintField } from 'state/mint/actions'

export default function usePriceCorrection(
  inputAmount?: CurrencyAmount,
  outputAmount?: CurrencyAmount,
  independentField?: SwapField | MintField,
  currencies?: {
    [key in SwapField | MintField]?: Currency | undefined
  },
  changeInput?: (e?: any) => void,
  changeOutput?: (e?: any) => void,
  poolExist?: boolean
): { [key in SwapField | MintField]?: () => void } {
  const Field = Object.values(SwapField).includes(independentField as any) ? SwapField : MintField
  const [inputField, outputField] = Object.values(Field)

  const priceCorrectFn = useMemo(() => {
    if (
      !independentField ||
      !currencies ||
      !changeInput ||
      !changeOutput ||
      !inputAmount ||
      !outputAmount ||
      !poolExist
    )
      return undefined

    const isExactIn = independentField === inputField
    const freeField = currencies[independentField]
    const is1155 = checkIs1155(freeField)
    const is721 = checkIs721(freeField)
    if (!is1155 && !is721) {
      const dependentField = independentField === inputField ? outputField : inputField
      const dependentCur = currencies[dependentField as keyof typeof currencies]
      if (!dependentCur) return undefined
      if (checkIs1155(dependentCur) || checkIs721(dependentCur)) {
        const nftAmountAvailable = isExactIn ? outputAmount.greaterThan('0') : inputAmount.greaterThan('0')
        if (!nftAmountAvailable) return
        const amount = isExactIn ? outputAmount.raw.toString() : inputAmount.raw.toString()
        const e = { target: { value: amount } } as any
        const handler = independentField === inputField ? () => changeOutput(e) : () => changeInput(e)
        return { [inputField]: isExactIn ? handler : undefined, [outputField]: isExactIn ? undefined : handler }
      }
    }
    return undefined
  }, [
    changeInput,
    changeOutput,
    currencies,
    independentField,
    inputAmount,
    inputField,
    outputAmount,
    outputField,
    poolExist
  ])

  return useMemo(() => {
    return {
      [inputField]: priceCorrectFn?.[inputField] ? <PriceCorrection onClick={priceCorrectFn[inputField]} /> : undefined,
      [outputField]: priceCorrectFn?.[outputField] ? (
        <PriceCorrection onClick={priceCorrectFn[outputField]} />
      ) : undefined
    }
  }, [inputField, outputField, priceCorrectFn])
}

const PriceCorrectButton = styled(Button)({
  height: 22,
  padding: '0px 10px',
  borderRadius: '10px',
  width: 'max-content',
  minWidth: 'unset',
  fontSize: 12,
  whiteSpace: 'nowrap'
})

function PriceCorrection({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null
  return (
    <Box
      display="flex"
      gap={10}
      alignItems="center"
      justifyContent={{ xs: 'flex-end', sm: 'flex-start' }}
      marginTop={{ xs: 0, sm: -21 }}
    >
      <Typography color="error" fontSize={12} textAlign="right">
        You are using too many / little assets
      </Typography>
      <PriceCorrectButton onClick={onClick}>price correction</PriceCorrectButton>
    </Box>
  )
}
