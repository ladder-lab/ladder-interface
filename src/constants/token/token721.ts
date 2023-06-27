import { ChainId } from '../chain'
import { Token } from '@ladder/sdk'
import { Axios } from 'utils/axios'

/**
 * Represents an ERC721 token with a unique address and some metadata.
 */

export class Token721 extends Token {
  public readonly tokenId: string | number | undefined
  public readonly is721: true
  public name?: string
  public uri?: string
  public symbol?: string
  public tokenUri?: string

  public constructor(
    chainId: ChainId,
    address: string,
    tokenId: string | number | undefined,
    metadata?: {
      name?: string
      symbol?: string
      uri?: string
      tokenUri?: string
    }
  ) {
    super(chainId, address, 0, metadata?.symbol, metadata?.name)
    this.tokenId = tokenId === '' ? undefined : tokenId
    this.is721 = true
    this.uri = metadata?.uri
    this.name = metadata?.name ?? 'ERC721'
    this.symbol = metadata?.symbol ?? 'NFT'
    this.tokenUri = metadata?.tokenUri ?? ''
    if ((!metadata || !metadata.uri) && chainId !== ChainId.SEPOLIA) {
      Axios.getMetadata(address, tokenId ?? '1')
        .then(r => {
          const data = r.data.data
          if (!metadata?.uri) {
            this.uri = data?.image_uri ?? ''
          }
          if (!metadata?.name) {
            this.name = data?.name ?? data?.contract_name ?? ''
          }
          if (!metadata?.symbol) {
            this.symbol = data?.contract_name ?? data?.name ?? ''
          }
        })
        .catch(e => {
          console.error(e)
        })
    } else if (metadata && metadata.tokenUri) {
      const _tokenUri = metadata.tokenUri + (tokenId !== undefined && tokenId !== '' ? tokenId : '1')
      Axios.get(_tokenUri)
        .then(r => {
          const metadata: any = r.data
          this.uri = metadata.image
          if (tokenId !== undefined && tokenId !== '') this.name = metadata.name
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
  public equals(other: Token721): boolean {
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
