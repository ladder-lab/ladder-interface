import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token, ChainId, currencyEquals } from '@uniswap/sdk'
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'
import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'

import { useActiveWeb3React } from './index'
import { use1155Contract, useBytes32TokenContract, useTokenContract } from './useContract'
import { arrayify } from 'ethers/lib/utils'
import { TokenList, WrappedTokenInfo } from 'models/tokenList'
import { listToTokenMap } from 'utils/swap/listUtils'
import { useUserAddedTokens } from 'state/user/hooks'
import { Token1155 } from 'constants/token/token1155'
import { IS_TEST_NET } from 'constants/chain'

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

export type TokenAddressMap = Readonly<{
  [chainId in ChainId]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
}>

export function useDefaultTokenList(): TokenAddressMap {
  return listToTokenMap(DEFAULT_TOKEN_LIST)
}

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce<{ [address: string]: Token }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded])
}
const testTokens = {
  '0xD64b11169B87030EB5647Add8265d2F1D30cF2e6': new WrappedTokenInfo(
    {
      chainId: 4,
      address: '0xD64b11169B87030EB5647Add8265d2F1D30cF2e6',
      decimals: 18,
      symbol: 'TEST',
      name: 'Test Coin',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735/logo.png'
    },
    []
  )
}
export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useDefaultTokenList()
  const tokens = useTokensFromMap(allTokens, true)
  return useMemo(() => ({ ...tokens, ...(IS_TEST_NET ? testTokens : {}) }), [tokens])
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useToken1155(tokenAddress?: string, tokenId?: string | number): Token1155 | undefined | null {
  const { chainId } = useActiveWeb3React()

  const address = isAddress(tokenAddress)
  const arg = useMemo(() => [tokenId], [tokenId])
  const tokenContract = use1155Contract(address ? address : undefined)

  const tokenName = useSingleCallResult(tokenContract, 'name', undefined, NEVER_RELOAD)
  const symbol = useSingleCallResult(tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const uri = useSingleCallResult(tokenContract, 'uri', arg, NEVER_RELOAD)

  return useMemo(() => {
    if (!chainId || !address || !tokenId) return undefined
    if (symbol.loading || tokenName.loading) return null

    return new Token1155(
      chainId,
      address,
      tokenId,
      undefined,
      tokenName.result?.[0],
      symbol.result?.[0],
      uri.result?.[0]
    )
  }, [address, chainId, symbol.loading, symbol.result, tokenId, tokenName.loading, tokenName.result, uri.result])
}

export function useCurrency(currencyId: string | undefined, tokenId?: string | number): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token1155 = useToken1155(!isETH && tokenId ? currencyId : undefined, tokenId)
  const token = useToken(isETH || tokenId ? undefined : currencyId)

  return tokenId ? token1155 : isETH ? ETHER : token
}
