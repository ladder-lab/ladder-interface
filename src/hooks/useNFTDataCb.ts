import { useEffect, useMemo, useState } from 'react'
import ERC1155_ABI from 'constants/abis/erc1155.json'
//import ERC1155_ABI from 'constants/abis/erc1155.json'
import { useContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import JSBI from 'jsbi'
//import { useSingleCallResult } from 'state/multicall/hooks'
import { isAddress } from 'utils'
import { useBlockNumber } from 'state/application/hooks'
// import { getOtherNetworkLibrary } from 'connectors/MultiNetworkConnector'
// import NFT_BRIDGE_ABI from 'constants/abis/nft_bridge.json'
import { NFT } from 'models/nft'
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
  const [ownerError, setOwnerError] = useState(false)
  const [ownerRes, setOwnerRes] = useState()
  const [ownerResLoading, setOwnerResLoading] = useState(false)
  const [nftError, setNftError] = useState(false)
  const [nftRes, setNftRes] = useState()
  const [nftResLoading, setNftResLoading] = useState(false)
  // const arg = useMemo(() => [tokenId], [tokenId])
  // const args = useMemo(() => [contractAddress, tokenId], [contractAddress, tokenId])
  //const bridgeContract = useNFTBridgeContract()
  const nftContract = useContract(isAddress(contractAddress) ? contractAddress : undefined, ERC1155_ABI, true)
  // const ownerRes = useSingleCallResult(tokenId ? nftContract : null, 'ownerOf', arg)
  // const nftRes = useSingleCallResult(tokenId ? bridgeContract : null, 'mappingNftInfo', args)

  useEffect(() => {
    const ownerOf = async () => {
      try {
        if (!tokenId || !nftContract) return
        setOwnerResLoading(true)
        const _ownerRes = await nftContract.ownerOf(tokenId)
        setOwnerRes(_ownerRes)
        setOwnerResLoading(false)
        setOwnerError(false)
      } catch (e) {
        console.log('load error: _ownerRes', e)
        setOwnerRes(undefined)
        setOwnerResLoading(false)
        setOwnerError(true)
      }
    }
    ownerOf()
  }, [blockNumber, nftContract, ownerRes, tokenId])

  useEffect(() => {
    if (!nftContract || !contractAddress || !tokenId) return
    setNftResLoading(true)
    nftContract
      .mappingNftInfo(contractAddress, tokenId)
      .then((res: any) => {
        setNftResLoading(false)
        setNftRes(res)
        setNftError(false)
      })
      .catch((e: any) => {
        setNftRes(undefined)
        setNftError(true)
        setNftResLoading(false)
        console.log('load error:', e)
      })
  }, [nftContract, contractAddress, tokenId])

  const response = useMemo(
    () => ({
      loading: ownerResLoading || nftResLoading,
      error: (!ownerRes && !ownerResLoading) || nftError || ownerError ? 'Contract Error' : '',
      nft: {
        tokenId,
        name: nftRes?.[0],
        symbol: nftRes?.[1],
        mainChainId: nftRes?.[2] ? +JSBI.BigInt(nftRes?.[2]).toString() : undefined,
        contractAddress: contractAddress,
        mainAddress: nftRes?.[3] || '',
        tokenUri: nftRes?.[4],
        owner: ownerRes || '',
        chainId: chainId
      }
    }),
    [chainId, contractAddress, nftError, nftRes, nftResLoading, ownerError, ownerRes, ownerResLoading, tokenId]
  )

  return response
}
