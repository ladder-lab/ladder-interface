import { Currency, Token } from 'constants/token'
import { Token1155 } from 'constants/token/token1155'
import { Token721 } from 'constants/token/token721'

export type AllTokens = Currency | Token1155 | Token

export type NFT = Token1155 | Token721

export type TokenType = 'erc1155' | 'erc20' | 'erc721'
