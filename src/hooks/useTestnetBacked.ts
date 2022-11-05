import { useEffect, useState } from 'react'
import { Axios } from 'utils/axios'

export interface TestnetNFTSwapDataProp {
  account: string
  buyToken: 'ERC721' | 'ERC20' | 'ERC1155'
  flag: number
  hash: string
  id: string
  pair: string
  sellToken: 'ERC721' | 'ERC20' | 'ERC1155'
  type: 1 | 2
}

/**
 * @param account
 * @param type 721 2, 1155 1
 * @returns
 */
export function useTestnetNFTSwapData(account: string | undefined, type: 1 | 2) {
  const [res721Data, setRes721Data] = useState<TestnetNFTSwapDataProp[]>()

  useEffect(() => {
    if (!account) {
      setRes721Data(undefined)
      return
    }
    Axios.post(
      '/checkNftSwap',
      { address: account, type },
      {},
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      },
      true
    )
      .then(res => {
        if (res.data?.data) {
          setRes721Data(res.data.data)
        } else {
          setRes721Data(undefined)
        }
      })
      .catch(() => setRes721Data(undefined))
  }, [account, type])

  return res721Data
}
