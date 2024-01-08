import { ChainListMap } from 'constants/chain'
import { ChainNetwork, Oracle } from 'ladder-sdk-beta'
import { SupportChain } from 'ladder-sdk-beta/dist/web3'
import { useEffect, useMemo, useState } from 'react'
import { use721PairV2Contract } from './useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useToken721PairTradePrice(
  isErc721: boolean,
  erc721Token: string | undefined,
  erc20Token: string | undefined,
  chainId: number,
  direction?: 'Buy' | 'Sell'
) {
  const [swapNumber, setSwapNumber] = useState<string>('')

  useEffect(() => {
    const func = async () => {
      if (!isErc721) return
      const chainNetWork = new ChainNetwork(ChainListMap[chainId].name as SupportChain)
      const oracle = new Oracle(chainNetWork)
      try {
        const priceRes = await oracle.getPrice(erc721Token || '', 1, direction || 'Buy', erc20Token)

        setSwapNumber(priceRes)
      } catch (error) {
        console.error(error)
      }
    }
    func()
  }, [chainId, isErc721, direction, erc20Token, erc721Token])

  return {
    swapNumber
  }
}

export function useGetLPTokenPair(address: string) {
  const pairV2Contract = use721PairV2Contract(address)
  const preTokenRes0 = useSingleCallResult(pairV2Contract, 'token0')
  const preTokenRes1 = useSingleCallResult(pairV2Contract, 'token1')

  const token0Address = useMemo(() => preTokenRes0.result?.[0] ?? undefined, [preTokenRes0.result])
  const token1Address = useMemo(() => preTokenRes1.result?.[0] ?? undefined, [preTokenRes1.result])

  return {
    token0: token0Address,
    token1: token1Address
  }
}
