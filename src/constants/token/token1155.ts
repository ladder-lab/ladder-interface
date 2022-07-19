import { validateAndParseAddress } from './utils'
import { ChainId } from '../chain'
// import ERC1155Abi from 'constants/abis/erc1155.json'
import { Currency } from '@uniswap/sdk'
// import { getContract } from 'utils'
import { Web3Provider } from '@ethersproject/providers'

/**
 * Represents an ERC1155 token with a unique address and some metadata.
 */
export class Token1155 extends Currency {
  public readonly chainId: ChainId
  public readonly address: string
  public readonly tokenId: string
  public readonly name?: string
  public readonly is1155: boolean
  public uri?: string

  public constructor(
    chainId: ChainId,
    address: string,
    tokenId: string,
    library?: Web3Provider,
    name?: string,
    symbol?: string,
    uri?: string
  ) {
    super(0, symbol)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
    this.tokenId = tokenId
    this.name = name
    this.is1155 = true
    this.uri = uri
    if (!library || uri) {
      return
    }
    // const contract = getContract(address, ERC1155Abi, library)
    // contract
    //   .uri()
    //   .then(() => {})
    //   .catch((e: Error) => {
    //     console.error(e)
    //   })
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
    return this.chainId === other.chainId && this.address === other.address && this.tokenId === other.tokenId
  }

  public setUri(uri: string) {
    this.uri = uri
  }
}
