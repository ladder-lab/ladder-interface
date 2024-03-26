import { ChainId } from '@ladder/sdk'
import { getTest721uriWithIndex, isTest721 } from 'constants/default721List'
import { Token721 } from 'constants/token/token721'
import { useActiveWeb3React } from 'hooks'
import { useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { use721PairContract } from './useContract'

export function useToken721PoolIds(pairAddress: string | undefined, collection: Token721 | undefined) {
  const { chainId } = useActiveWeb3React()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 100
  const contract = use721PairContract(pairAddress)
  const length = useSingleCallResult(contract, 'erc721MapLength')
  const [, setRefresh] = useState(false)

  const maxLength = useMemo(() => (length.result ? Number(length.result.toString()) : undefined), [length.result])

  const args = useMemo(() => {
    return maxLength ? [(currentPage - 1) * pageSize, pageSize] : undefined
  }, [currentPage, maxLength])

  const ids = useSingleCallResult(args ? contract : null, 'erc721IDlist', args)

  const results = useMemo(() => {
    const isTeset721 = collection?.address && chainId === ChainId.SEPOLIA && isTest721(collection?.address)

    return {
      loading: ids.loading,
      poolTokens:
        ids.result && collection
          ? ids.result?.[0]?.map((id: any) => {
              const _t = new Token721(
                collection?.chainId,
                collection?.address,
                id.toString(),
                {
                  name: collection.name,
                  symbol: collection.symbol,
                  tokenUri: collection.tokenUri,
                  uri:
                    isTeset721 && !collection.tokenUri ? getTest721uriWithIndex(collection?.uri || '', id) : undefined
                },
                () => {
                  setRefresh(prev => !prev)
                }
              )
              return _t
            })
          : undefined,
      page: {
        setCurrentPage: (page: number) => setCurrentPage(page),
        currentPage,
        count: maxLength || 0,
        totalPage: maxLength ? Math.ceil(maxLength / pageSize) : 0,
        pageSize
      }
    }
  }, [chainId, collection, currentPage, ids.loading, ids.result, maxLength])
  return results
}
