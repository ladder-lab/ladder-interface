import { Currency, Token } from 'constants/token'
import { Token1155 } from 'constants/token/token1155'

export type AllTokens = Currency | Token1155 | Token

export type NFT = Token1155
export type Token721 = Token1155 // [TODO] Define Token721

export type TokenType = 'erc1155' | 'erc20' | 'erc721'
