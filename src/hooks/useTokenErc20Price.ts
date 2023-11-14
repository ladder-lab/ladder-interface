import { ChainId } from 'constants/chain'
import { useMemo } from 'react'

const TokensPrice = {
  [11155111]: {
    '0x85edb7a0cbacf5bd641e0ff5d6270bef9c72bd6b': '1',
    '0xadefa85603c36fce62919fd85cf60f90cb8dc642': '1704.61',
    '0x5069129410122a4c1f2448c77becdc5a8a784a5d': '1704.61',
    '0x55979784068d1bef37b49f41cac8040a4b79c4a7': '1',
    '0xa4560e8b4694b437d77452ebc2de179aaa1137c3': '1704.61'
  }
}

function useTestChainToken(chainId: number): { [address: string]: string } {
  return useMemo(() => ({ ...(chainId === 11155111 ? TokensPrice[11155111] : {}) }), [chainId])
}

export function useTokenErc20Price(tokenAddress: string | undefined, chainId: number) {
  const tokens = useTestChainToken(chainId)
  return useMemo(() => {
    if (chainId === ChainId.SEPOLIA) {
      if (tokenAddress) return tokens[tokenAddress]
    }
    return '0'
  }, [chainId, tokenAddress, tokens])
}
