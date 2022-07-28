import { TransactionResponse } from '@ethersproject/providers'
import { ETHER } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { useActiveWeb3React } from 'hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { AllTokens } from 'models/allTokens'
import { useCallback, useMemo } from 'react'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { checkIs1155, filter1155 } from 'utils/checkIs1155'
import { wrappedCurrency } from 'utils/wrappedCurrency'

export function usePoolCallback(currencyA: AllTokens | undefined, currencyB: AllTokens | undefined) {
  const { chainId, library, account } = useActiveWeb3React()

  const { parsedAmounts, noLiquidity } = useDerivedMintInfo(currencyA, currencyB)
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
      estimate = router.estimateGas.addLiquidityETH1155
      method = router.addLiquidityETH1155
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        tokenBIsETH ? filter1155(currencyA)?.tokenId ?? '' : filter1155(currencyB)?.tokenId ?? '', //tokenId
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      const tokenAIs1155 = checkIs1155(currencyA)
      const token1155 = filter1155(tokenAIs1155 ? currencyA : currencyB)
      const token = tokenAIs1155 ? currencyB : currencyA
      estimate = router.estimateGas.addLiquidity1155
      method = router.addLiquidity1155
      args = [
        token1155?.address ?? '',
        token1155?.tokenId ?? '',
        wrappedCurrency(token, chainId)?.address ?? '',
        (tokenAIs1155 ? parsedAmountA : parsedAmountB).raw.toString(),
        (tokenAIs1155 ? parsedAmountB : parsedAmountA).raw.toString(),
        amountsMin[tokenAIs1155 ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
        amountsMin[tokenAIs1155 ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
        account,
        deadline.toHexString()
      ]
      value = null
    }
    const estimatedGasLimit = await estimate(...args, value ? { value } : {})

    return method(...args, {
      ...(value ? { value } : {}),
      gasLimit: calculateGasMargin(estimatedGasLimit)
    })
  }, [account, allowedSlippage, chainId, currencyA, currencyB, deadline, library, noLiquidity, parsedAmounts])

  return useMemo(
    () => ({
      addLiquidityCb
    }),
    [addLiquidityCb]
  )
}
