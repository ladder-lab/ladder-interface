import { useEffect, useMemo, useState } from 'react'
//import ERC1155_ABI from 'constants/abis/erc1155.json'
import { use1155Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
//import { useSingleCallResult } from 'state/multicall/hooks'
import { isAddress } from 'utils'
import { useBlockNumber } from 'state/application/hooks'
// import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'
// import NFT_BRIDGE_ABI from 'constants/abis/nft_bridge.json'
import { Token1155 } from 'constants/token/token1155'
import { NFT } from 'models/allTokens'
// import { NFT_BRIDGE_ADDRESS } from '../constants'

export function useNFTDataCb(
  contractAddress: string,
  tokenId: string
): {
  loading: boolean
  error: string
  nft: NFT | null
} {
  const { chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const [nftError, setNftError] = useState(false)

  const [nftResLoading, setNftResLoading] = useState(false)
  const [token, setToken] = useState<Token1155 | null>(null)
  // const arg = useMemo(() => [tokenId], [tokenId])
  // const args = useMemo(() => [contractAddress, tokenId], [contractAddress, tokenId])
  //const bridgeContract = useNFTBridgeContract()
  const nftContract = use1155Contract(isAddress(contractAddress) ? contractAddress : undefined)

  useEffect(() => {
    const getNftData = async () => {
      try {
        if (!chainId || !tokenId || !nftContract) return
        setNftResLoading(true)
        const allRes = await Promise.all([nftContract.name(), nftContract.symbol(), nftContract.uri(tokenId ?? '')])
        const userToken = new Token1155(chainId, contractAddress, tokenId, {
          name: allRes[0],
          symbol: allRes[1],
          uri: allRes[2]
        })
        setToken(userToken)
        setNftResLoading(false)
        setNftError(false)
      } catch (e: any) {
        console.log('load error: _ownerRes', e)
        setNftError(e.message)
        setNftResLoading(false)
      }
    }
    getNftData()
  }, [blockNumber, chainId, contractAddress, nftContract, tokenId])

  const response = useMemo(
    () => ({
      loading: nftResLoading,
      error: nftError ? 'Contract Error' : '',
      nft: token
    }),
    [nftError, nftResLoading, token]
  )

  return response
}
