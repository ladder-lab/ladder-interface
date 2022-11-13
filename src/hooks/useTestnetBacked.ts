import { useEffect, useMemo, useState } from 'react'
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

export interface TestnetStatusProp {
  pairIsFin: boolean
  buy721Completed: boolean
  sell721Completed: boolean
  buy1155Completed: boolean
  sell1155Completed: boolean
}
export function useTestnetV2Status(account: string | undefined): TestnetStatusProp {
  const NFT721SwapData = useTestnetNFTSwapData(account, 2)
  const NFT1155SwapData = useTestnetNFTSwapData(account, 1)
  const [pairIsFin, setPairIsFin] = useState(false)

  useEffect(() => {
    if (!account) {
      setPairIsFin(false)
      return
    }
    Axios.get('/checkLpByAddress', { address: account })
      .then(res => {
        if (res.data?.data) {
          setPairIsFin(true)
        } else {
          setPairIsFin(false)
        }
      })
      .catch(() => setPairIsFin(false))
  }, [account])

  const buy721Completed = useMemo(
    () => (NFT721SwapData ? NFT721SwapData.filter(item => item.buyToken === 'ERC721').length > 0 : false),
    [NFT721SwapData]
  )
  const sell721Completed = useMemo(() => {
    if (!NFT721SwapData) return false
    return NFT721SwapData ? NFT721SwapData.filter(item => item.sellToken === 'ERC721').length > 0 : false
  }, [NFT721SwapData])

  const buy1155Completed = useMemo(
    () => (NFT1155SwapData ? NFT1155SwapData.filter(item => item.buyToken === 'ERC1155').length > 0 : false),
    [NFT1155SwapData]
  )
  const sell1155Completed = useMemo(() => {
    if (!NFT1155SwapData) return false
    return NFT1155SwapData ? NFT1155SwapData.filter(item => item.sellToken === 'ERC1155').length > 0 : false
  }, [NFT1155SwapData])

  return {
    pairIsFin,
    buy721Completed,
    sell721Completed,
    buy1155Completed,
    sell1155Completed
  }
}
