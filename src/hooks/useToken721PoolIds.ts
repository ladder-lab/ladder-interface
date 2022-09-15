import { Token721 } from 'constants/token/token721'
import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { use721PairContract } from './useContract'

export function useToken721PoolIds(pairAddress: string | undefined, collection: Token721 | undefined) {
  const contract = use721PairContract(pairAddress)
  const length = useSingleCallResult(contract, 'erc721MapLength')

  const args = useMemo(() => {
    return length.result ? [0, length.result.toString()] : undefined
  }, [length?.result])

  const ids = useSingleCallResult(args ? contract : null, 'erc721IDlist', args)

  const results = useMemo(() => {
    return {
      loading: ids.loading,
      poolTokens:
        ids.result && collection
          ? ids.result?.[0]?.map((id: any) => new Token721(collection?.chainId, collection?.address, +id.toString()))
          : undefined
    }
  }, [collection, ids.loading, ids.result])
  return results
}
