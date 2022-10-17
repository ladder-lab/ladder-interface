import { ChainId } from '@ladder/sdk'
import { getTest721uri, isTest721 } from 'constants/default721List'
import { Token721 } from 'constants/token/token721'
import { useActiveWeb3React } from 'hooks'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { use721PairContract } from './useContract'

export function useToken721PoolIds(pairAddress: string | undefined, collection: Token721 | undefined) {
  const { chainId } = useActiveWeb3React()
  const contract = use721PairContract(pairAddress)
  const length = useSingleCallResult(contract, 'erc721MapLength')

  const args = useMemo(() => {
    return length.result ? [0, length.result.toString()] : undefined
  }, [length?.result])

  const ids = useSingleCallResult(args ? contract : null, 'erc721IDlist', args)

  const results = useMemo(() => {
    const isTeset721 = collection?.address && chainId === ChainId.GÖRLI && isTest721(collection?.address)

    return {
      loading: ids.loading,
      poolTokens:
        ids.result && collection
          ? ids.result?.[0]?.map(
              (id: any) =>
                new Token721(collection?.chainId, collection?.address, +id.toString(), {
                  name: collection.name,
                  symbol: collection.symbol,
                  uri: isTeset721 && collection.name ? getTest721uri(collection.name) : undefined
                })
            )
          : undefined
    }
  }, [chainId, collection, ids.loading, ids.result])
  return results
}
