import { useEffect, useMemo, useState } from 'react'
import { use1155Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { useBlockNumber } from 'state/application/hooks'
import { Token1155 } from 'constants/token/token1155'
import { NFT } from 'models/allTokens'
import { NETWORK_CHAIN_ID } from 'constants/chain'

const ERC1155InterfaceId = '0xd9b67a26'

export function useNFTDataCb(
  contractAddress: string,
  tokenId: string
): {
  loading: boolean
  error: string
  nft: NFT | null
  incorrectToken: boolean
} {
  const { chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const [nftError, setNftError] = useState(false)
  const [incorrectToken, setIncorrenctToken] = useState(false)

  const [nftResLoading, setNftResLoading] = useState(false)
  const [token, setToken] = useState<Token1155 | null>(null)
  // const arg = useMemo(() => [tokenId], [tokenId])
  // const args = useMemo(() => [contractAddress, tokenId], [contractAddress, tokenId])
  //const bridgeContract = useNFTBridgeContract()
  const nftContract = use1155Contract(isAddress(contractAddress) ? contractAddress : undefined)

  useEffect(() => {
    const getNftData = async () => {
      let is1155 = false
      try {
        if (!chainId || !tokenId || !nftContract) return
        setNftResLoading(true)

        const supports1155 = await nftContract.supportsInterface?.(ERC1155InterfaceId)
        is1155 = supports1155
        const allRes = await Promise.all([nftContract.name(), nftContract.symbol(), nftContract.uri(tokenId ?? '')])
        const userToken = new Token1155(chainId, contractAddress, tokenId, {
          name: allRes[0],
          symbol: allRes[1],
          uri: allRes[2]
        })
        setToken(userToken)
        setNftResLoading(false)
        setNftError(!is1155)
        setIncorrenctToken(!is1155)
      } catch (e: any) {
        if (!is1155) {
          setIncorrenctToken(true)
        } else {
          setToken(new Token1155(chainId ?? NETWORK_CHAIN_ID, contractAddress, tokenId))
        }
        // setNftError(true)
        setNftResLoading(false)
      }
    }
    getNftData()
  }, [blockNumber, chainId, contractAddress, nftContract, tokenId])

  const response = useMemo(
    () => ({
      loading: nftResLoading,
      error: nftError ? 'Contract Error' : '',
      nft: token,
      incorrectToken
    }),
    [incorrectToken, nftError, nftResLoading, token]
  )

  return response
}
