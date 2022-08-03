import { useEffect, useMemo, useState } from 'react'
//import ERC1155_ABI from 'constants/abis/erc1155.json'
import { use1155Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
//import { useSingleCallResult } from 'state/multicall/hooks'
import { isAddress } from 'utils'
import { useBlockNumber } from 'state/application/hooks'
// import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'
// import NFT_BRIDGE_ABI from 'constants/abis/nft_bridge.json'
import { NFT } from 'models/nft'
import { Token1155 } from 'constants/token/token1155'
// import { NFT_BRIDGE_ADDRESS } from '../constants'

export function useNFTDataCb(
  contractAddress: string,
  tokenId: string
): {
  loading: boolean
  error: string
  nft: NFT
} {
  const { chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const [nftError, setNftError] = useState(false)

  const [nftResLoading, setNftResLoading] = useState(false)
  const [token, setToken] = useState(null)
  // const arg = useMemo(() => [tokenId], [tokenId])
  // const args = useMemo(() => [contractAddress, tokenId], [contractAddress, tokenId])
  //const bridgeContract = useNFTBridgeContract()
  const nftContract = use1155Contract(isAddress(contractAddress) ? contractAddress : undefined)
  // const ownerRes = useSingleCallResult(tokenId ? nftContract : null, 'ownerOf', arg)
  // const nftRes = useSingleCallResult(tokenId ? bridgeContract : null, 'mappingNftInfo', args)

  useEffect(() => {
    const ownerOf = async () => {
      try {
        if (!tokenId  !nftContract) return
        setNftResLoading(true)

        const allRes = await Promise.all([nftContract.uri(tokenId ?? ''), nftContract.name(), nftContract.symbol()])

        // const _ownerRes = await nftContract.ownerOf(tokenId)
        // setOwnerRes(_ownerRes)
      } catch (e) {
        console.log('load error: _ownerRes', e)
        setNftError(e.message)
        setNftResLoading(false)
      }
    }
    ownerOf()
  }, [blockNumber, nftContract, tokenId])

  const response = useMemo(
    () => ({
      loading: ownerResLoading  nftResLoading,
      error: (!ownerRes && !ownerResLoading)  nftError  ownerError ? 'Contract Error' : '',
      nft: new Token1155(chainId, contractAddress)
      // nft: {
      //   tokenId,
      //   name: nftRes?.[0],
      //   symbol: nftRes?.[1],
      //   mainChainId: nftRes?.[2] ? +JSBI.BigInt(nftRes?.[2]).toString() : undefined,
      //   contractAddress: contractAddress,
      //   mainAddress: nftRes?.[3]  '',
      //   tokenUri: nftRes?.[4],
      //   owner: ownerRes  '',
      //   chainId: chainId
      // }
    }),
    [chainId, contractAddress, nftError, nftRes, nftResLoading, ownerError, ownerRes, ownerResLoading, tokenId]
  )

  return response
}