import { TransactionResponse } from '@ethersproject/providers'
import { ETHER } from '@uniswap/sdk'
import { BigNumber, Contract } from 'ethers'
import { splitSignature } from '@ethersproject/bytes'
import { useActiveWeb3React } from 'hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { AllTokens } from 'models/allTokens'
import { useCallback, useMemo, useState } from 'react'
import { useDerivedBurnInfo } from 'state/burn/hooks'
import { Field } from 'state/mint/actions'
import { Field as BurnField } from 'state/burn/actions'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useTokenPairAdder, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { checkIs1155, filter1155 } from 'utils/checkIs1155'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import { usePairContract } from './useContract'
import { ROUTER_ADDRESS } from 'constants/index'
import useIsArgentWallet from 'hooks/useIsArgentWallet'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import useModal from './useModal'
import { generateErc20 } from 'utils/getHashAddress'

export function useMintCallback(currencyA: AllTokens | undefined, currencyB: AllTokens | undefined) {
  const { chainId, library, account } = useActiveWeb3React()

  const { parsedAmounts, noLiquidity } = useDerivedMintInfo(currencyA, currencyB)
  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const addTokenPair = useTokenPairAdder()

  const addLiquidityCb = useCallback(async () => {
    if (!chainId || !library || !account || !currencyA || !currencyB) return

    addTokenPair(wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId))

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
    const isA1155 = checkIs1155(currencyA)
    const isB1155 = checkIs1155(currencyB)

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      const noNft = !isA1155 && !isB1155
      const methodName = noNft ? 'addLiquidityETH' : 'addLiquidityETH1155'
      estimate = router.estimateGas[methodName]
      method = router[methodName]
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        ...(noNft ? [] : [tokenBIsETH ? filter1155(currencyA)?.tokenId ?? '' : filter1155(currencyB)?.tokenId ?? '']), //tokenId
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      const tokenAIs1155 = checkIs1155(currencyA)
      const noNft = !isA1155 && !isB1155
      const methodName = noNft ? 'addLiquidity' : 'addLiquidity1155'
      const token1155 = filter1155(tokenAIs1155 ? currencyA : currencyB)
      const token = tokenAIs1155 ? currencyB : currencyA
      estimate = router.estimateGas[methodName]
      method = router[methodName]
      args = [
        token1155?.address ?? '',
        ...(noNft ? [] : [token1155?.tokenId ?? '']),
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
  }, [
    account,
    addTokenPair,
    allowedSlippage,
    chainId,
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

export function useBurnCallback(currencyA: AllTokens | undefined, currencyB: AllTokens | undefined) {
  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  const { showModal, hideModal } = useModal()
  const { chainId, library, account } = useActiveWeb3React()
  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const { parsedAmounts, pair } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const Field = BurnField
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)
  const isArgentWallet = useIsArgentWallet()

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  const burnCallback = useCallback(async () => {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0]
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    const [tokenA, tokenB] = [
      generateErc20(wrappedCurrency(currencyA, chainId)),
      generateErc20(wrappedCurrency(currencyB, chainId))
    ]

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString()
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString()
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
      return null
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      return router[methodName](...args, {
        gasLimit: safeGasEstimate
      })
    }
  }, [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
    Field.LIQUIDITY,
    account,
    allowedSlippage,
    approval,
    chainId,
    currencyA,
    currencyB,
    deadline,
    library,
    parsedAmounts,
    signatureData
  ])

  const burnApproveCallback = useCallback(async () => {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (isArgentWallet) {
      return approveCallback()
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Uniswap V2',
      version: '1',
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })
    showModal(<TransacitonPendingModal />)
    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        hideModal()
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }, [
    Field.LIQUIDITY,
    account,
    approveCallback,
    chainId,
    deadline,
    hideModal,
    isArgentWallet,
    library,
    pair,
    pairContract,
    parsedAmounts,
    showModal
  ])

  return { burnCallback, burnApproveCallback, setSignatureData, approval, signatureData }
}
