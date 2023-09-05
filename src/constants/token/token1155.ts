import { ChainId } from '../chain'
// import ERC1155Abi from 'constants/abis/erc1155.json'
import { Token } from '@ladder/sdk'
import { Axios } from 'utils/axios'
// import { getContract } from 'utils'

/**
 * Represents an ERC1155 token with a unique address and some metadata.
 */
export class Token1155 extends Token {
  public readonly tokenId: string | number
  public readonly is1155: boolean
  public name?: string
  public uri?: string
  public symbol?: string

  public constructor(
    chainId: ChainId,
    address: string,
    tokenId: string | number,
    metadata?: {
      name?: string
      symbol?: string
      uri?: string
    }
  ) {
    super(chainId, address, 0, metadata?.symbol, metadata?.name)
    this.tokenId = tokenId + ''
    this.is1155 = true
    this.uri = metadata?.uri
    this.name = metadata?.name ?? 'ERC1155'
    this.symbol = metadata?.symbol ?? 'NFT'

    if ((!metadata || !metadata.uri) && chainId !== ChainId.SEPOLIA) {
      Axios.getMetadata(address, tokenId)
        .then(r => {
          const data = r.data.data
          this.uri = data?.image_uri ?? data?.logo_url ?? ''
          this.name = data?.name ?? data?.contract_name ?? 'ERC1155'
          this.symbol = data?.contract_name ?? data?.name ?? 'NFT'
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token1155): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return (
      this.chainId === other.chainId &&
      this.address.toLocaleLowerCase() === other.address.toLocaleLowerCase() &&
      this.tokenId === other.tokenId
    )
  }

  public setUri(uri: string) {
    this.uri = uri
  }
}
