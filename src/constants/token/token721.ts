import { ChainId } from '../chain'
import { Token } from '@ladder/sdk'
import { getAlchemy } from 'utils/alchemy'
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
    },
    refresh?: () => void
  ) {
    super(chainId, address, 0, metadata?.symbol, metadata?.name)
    this.tokenId = tokenId === '' ? undefined : tokenId
    this.is721 = true
    this.uri = metadata?.uri
    this.name = metadata?.name ?? 'ERC721'
    this.symbol = metadata?.symbol ?? 'NFT'
    this.tokenUri = metadata?.tokenUri ?? ''

    if ((!metadata || !metadata.uri) && chainId !== ChainId.SEPOLIA) {
      getAlchemy(chainId)
        .nft.getContractMetadata(address)
        .then(res => {
          console.log('res=>', res)
          this.uri = res.openSeaMetadata.imageUrl ?? ''
          this.name = res.name ?? res.openSeaMetadata.collectionName ?? 'ERC721'
          this.symbol = res.symbol ?? res.openSeaMetadata.collectionSlug ?? 'NFT'

          refresh && refresh()
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
        .catch(() => {
          // console.error(e)
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
