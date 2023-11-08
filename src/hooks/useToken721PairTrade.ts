import { ChainListMap } from 'constants/chain'
import { ChainNetwork, Oracle } from 'ladder-sdk-beta'
import { SupportChain } from 'ladder-sdk-beta/dist/web3'
import { useEffect, useState } from 'react'

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
