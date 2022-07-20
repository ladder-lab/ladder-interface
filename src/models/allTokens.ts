import { Currency, Token } from 'constants/token'
import { Token1155 } from 'constants/token/token1155'

export type AllTokens = Currency | Token1155 | Token

export type TokenType = 'erc1155' | 'erc20'
