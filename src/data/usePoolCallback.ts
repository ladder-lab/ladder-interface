import { TransactionResponse } from '@ethersproject/providers'
import { ETHER } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { AllTokens } from 'models/allTokens'
import { useCallback, useMemo } from 'react'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'

export function usePoolCallback(currencyA: AllTokens | undefined, currencyB: AllTokens | undefined) {
  const { chainId, library, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { currencies, parsedAmounts, noLiquidity } = useDerivedMintInfo(currencyA, currencyB)
  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()

  const addLiquidityCb = useCallback(async () => {
    if (!chainId || !library || !account) return

    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }

    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          // setTxHash(response.hash)
        })
      )
      .catch(error => {
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }, [
    account,
    addTransaction,
    allowedSlippage,
    chainId,
    currencies,
    currencyA,
    currencyB,
    deadline,
    library,
    noLiquidity,
    parsedAmounts
  ])

  return useMemo(
    () => ({
      addLiquidityCb
    }),
    [addLiquidityCb]
  )
}
