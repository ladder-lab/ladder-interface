import { Currency, Trade, TradeType } from '@ladder/sdk'
import { Box, Button, styled, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'

export default function usePriceCorrection(
  trade?: Trade,
  currencies?: {
    [key in Field]?: Currency | undefined
  },
  changeInput?: (e?: any) => void,
  changeOutput?: (e?: any) => void
) {
  const priceCorrectFn = useMemo(() => {
    if (!trade || !currencies || !changeInput || !changeOutput) return undefined

    const independentField = trade.tradeType === TradeType.EXACT_INPUT ? Field.INPUT : Field.OUTPUT

    const isExactIn = independentField === Field.INPUT
    const freeField = currencies[independentField]
    const is1155 = checkIs1155(freeField)
    const is721 = checkIs721(freeField)
    if (!is1155 && !is721) {
      const dependentField = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
      const dependentCur = currencies[dependentField]
      if (checkIs1155(dependentCur) || checkIs721(dependentCur)) {
        const amount = isExactIn ? trade.outputAmount.raw.toString() : trade.inputAmount.raw.toString()
        const e = { target: { value: amount } } as any
        const handler = independentField === Field.INPUT ? () => changeOutput(e) : () => changeInput(e)
        return { [Field.INPUT]: isExactIn ? handler : undefined, [Field.OUTPUT]: isExactIn ? undefined : handler }
      }
    }
    return undefined
  }, [changeInput, changeOutput, currencies, trade])

  return useMemo(() => {
    return {
      [Field.INPUT]: priceCorrectFn?.[Field.INPUT] ? (
        <PriceCorrection onClick={priceCorrectFn[Field.INPUT]} />
      ) : undefined,
      [Field.OUTPUT]: priceCorrectFn?.[Field.OUTPUT] ? (
        <PriceCorrection onClick={priceCorrectFn[Field.OUTPUT]} />
      ) : undefined
    }
  }, [priceCorrectFn])
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
      <PriceCorrectButton onClick={onClick} variant="outlined">
        price correction
      </PriceCorrectButton>
    </Box>
  )
}
