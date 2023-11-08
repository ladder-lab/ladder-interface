import { Token } from '@ladder/sdk'

export interface Version {
  readonly major: number
  readonly minor: number
  readonly patch: number
}

export interface TokenList {
  readonly name: string
  readonly timestamp: string
  readonly version: Version
  readonly tokens: TokenInfo[]
  readonly keywords?: string[]
  readonly tags?: Tags
  readonly logoURI?: string
}

interface Tags {
  readonly [tagId: string]: {
    readonly name: string
    readonly description: string
  }
}

type TagDetails = Tags[keyof Tags]

export interface TagInfo extends TagDetails {
  id: string
}

export interface TokenInfo {
  readonly chainId: number
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly price?: string
  readonly logoURI?: string
  readonly tags?: string[]
}

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}
