import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token, ChainId, currencyEquals, WETH } from '@ladder/sdk'
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'
import { useEffect, useMemo, useState } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { getContract, isAddress } from '../utils'
import { useActiveWeb3React } from './index'
import { use1155Contract, use721Contract, useBytes32TokenContract, useTokenContract } from './useContract'
import { arrayify } from 'ethers/lib/utils'
import { TokenList, WrappedTokenInfo } from 'models/tokenList'
import { listToTokenMap } from 'utils/swap/listUtils'
import { useUserAddedTokens, useUserAddedTokens1155, useUserAddedTokens721 } from 'state/user/hooks'
import { Token1155 } from 'constants/token/token1155'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { DEFAULT_1155_LIST } from 'constants/default1155List'
import { DEFAULT_721_LIST } from 'constants/default721List'
import { Token721 } from 'constants/token/token721'
import ERC721_ABI from 'constants/abis/erc721.json'
import tUSDCImg from 'assets/images/tUSDC.jpg'
import tWETHImg from 'assets/images/tWETH.jpg'

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

export function useIsUserAddedToken1155(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens1155()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find(token1155 => currencyEquals(currency, token1155))
}

export function useIsUserAddedToken721(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens721()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find(token721 => currencyEquals(currency, token721))
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
  [5]: {
    '0x0F85225ab45b77DA055c5B5f9e5F4F919A1D17EA ': new WrappedTokenInfo(
      {
        chainId: 5,
        address: '0x0F85225ab45b77DA055c5B5f9e5F4F919A1D17EA',
        decimals: 18,
        symbol: 'tWETH',
        name: 'testETH-LadderV2-ETH-Testnet'
      },
      []
    ),
    '0x314195C69d8F0236939a31f64cB367764672CA0f ': new WrappedTokenInfo(
      {
        chainId: 5,
        address: '0x314195C69d8F0236939a31f64cB367764672CA0f',
        decimals: 18,
        symbol: 'tUSDC',
        name: 'testUSDC-LadderV2-USDC-Testnet'
      },
      []
    )
  },
  [11155111]: {
    '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B': new WrappedTokenInfo(
      {
        chainId: 11155111,
        address: '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B',
        decimals: 18,
        symbol: 'tUSDC-V2',
        name: 'testUSDC-LadderV2-USDC-Testnet',
        logoURI: tUSDCImg
      },
      []
    ),
    '0xaDefa85603c36FcE62919fd85Cf60F90cb8Dc642': new WrappedTokenInfo(
      {
        chainId: 11155111,
        address: '0xaDefa85603c36FcE62919fd85Cf60F90cb8Dc642',
        decimals: 18,
        symbol: 'tWETH',
        name: 'testETH-LadderV3-ETH-Testnet',
        logoURI: tWETHImg
      },
      []
    ),
    '0x5069129410122A4C1F2448c77becDc5A8A784a5D': new WrappedTokenInfo(
      {
        chainId: 11155111,
        address: '0x5069129410122A4C1F2448c77becDc5A8A784a5D',
        decimals: 18,
        symbol: 'tWETH_V2',
        name: 'testETH-LadderV2-ETH-Testnet',
        logoURI: tWETHImg
      },
      []
    ),
    '0x55979784068d1BEf37B49F41cAC8040A4b79C4a7': new WrappedTokenInfo(
      {
        chainId: 11155111,
        address: '0x55979784068d1BEf37B49F41cAC8040A4b79C4a7',
        decimals: 18,
        symbol: 'tUSDC',
        name: 'ladder-test3-usdc',
        logoURI: tUSDCImg
      },
      []
    ),
    [WETH[11155111].address]: WETH[11155111]
  }
}
export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useDefaultTokenList()
  const { chainId } = useActiveWeb3React()
  //add user added tokens
  const tokens = useTokensFromMap(allTokens, true)
  return useMemo(() => ({ ...tokens, ...(chainId === 11155111 ? testTokens[11155111] : {}) }), [tokens, chainId])
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

const interface1155 = ['0xd9b67a26']

export function useToken1155(tokenAddress?: string, tokenId?: string | number): Token1155 | undefined | null {
  const [is1155, setIs1155] = useState(false)
  const [meta, setMeta] = useState({ name: 'Erc1155', symbol: 'ERC1155' })
  const { chainId, library } = useActiveWeb3React()
  const address = isAddress(tokenAddress)
  const nftContract = use1155Contract(address ? address : undefined)

  useEffect(() => {
    if (tokenAddress && library)
      checkTokenType(tokenAddress, library).then(r => {
        if (r === 'erc1155') {
          setIs1155(true)
        }
      })
  }, [library, tokenAddress])

  useEffect(() => {
    if (is1155 && nftContract) {
      ;(async () => {
        try {
          const data = await Promise.all([nftContract.name(), nftContract.symbol()])
          if (data) {
            setMeta({ name: data[0] ?? 'Erc1155', symbol: data[1] ?? 'ERC1155' })
          }
        } catch (e) {}
      })()
    }
  }, [is1155, nftContract])

  return useMemo(() => {
    if (!chainId || !address || !tokenId) return undefined
    const list = DEFAULT_1155_LIST[chainId ?? NETWORK_CHAIN_ID]
    if (list) {
      const token = list.find(token1155 => token1155.address === tokenAddress && token1155.tokenId == tokenId)
      if (token) return token
    }
    return is1155 ? new Token1155(chainId, address, tokenId, { name: meta.name, symbol: meta.symbol }) : undefined
  }, [address, chainId, is1155, meta.name, meta.symbol, tokenAddress, tokenId])
}

const interface721 = ['0x80ac58cd']

export function useToken721(
  tokenAddress?: string,
  tokenId?: string | number | undefined,
  loadingCb?: any
): Token721 | undefined | null {
  const [is721, setIs721] = useState(false)
  const { chainId, library } = useActiveWeb3React()
  const address = isAddress(tokenAddress)
  const nftContract = use721Contract(address ? address : undefined)

  const nameRes = useSingleCallResult(is721 ? nftContract : null, 'name')
  const symbolRes = useSingleCallResult(is721 ? nftContract : null, 'symbol')

  useEffect(() => {
    if (tokenAddress && library)
      checkTokenType(tokenAddress, library).then(r => {
        if (r === 'erc721') {
          setIs721(true)
        }
      })
  }, [library, tokenAddress])

  useEffect(() => {
    loadingCb && loadingCb(!!nameRes?.loading)
  }, [loadingCb, nameRes?.loading])

  return useMemo(() => {
    if (!chainId || !address) return undefined
    const list = DEFAULT_721_LIST[chainId ?? NETWORK_CHAIN_ID]
    if (list) {
      const token = list.find(token721 => token721.address === tokenAddress)
      if (token) return token
    }
    return nameRes.result && is721
      ? new Token721(chainId, address, tokenId, { name: nameRes.result?.[0], symbol: symbolRes.result?.[0] })
      : undefined
  }, [address, chainId, is721, nameRes.result, symbolRes.result, tokenAddress, tokenId])
}

export function useToken721WithLoadingIndicator(
  tokenAddress?: string,
  tokenId?: string | number | undefined
): { loading: boolean; token721: Token721 | undefined | null } {
  const [loading, setLoading] = useState(false)
  const token721 = useToken721(tokenAddress, tokenId, setLoading)

  return { loading: !!loading, token721: token721 }
}

export function useCurrency(
  currencyId: string | undefined,
  tokenId?: string | number,
  tokenStandard?: string
): Currency | null | undefined {
  const { library } = useActiveWeb3React()
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const [tokenType, setTokenType] = useState<undefined | string>(undefined)
  const noId = currencyId === 'undefined'
  useEffect(() => {
    if (noId) return
    if (!isETH && tokenStandard) {
      setTokenType(tokenStandard)
      return
    }
    setTokenType(undefined)
    if (isETH || !currencyId || !library) return
    if (!!tokenId) {
      if (tokenId === 'erc721') {
        setTokenType('erc721')
        return
      }
      setTokenType('erc1155')
      return
    }
    checkTokenType(currencyId, library).then(r => {
      setTokenType(r)
    })
  }, [currencyId, isETH, library, noId, tokenId, tokenStandard])

  const token1155 = useToken1155(!isETH && tokenType === 'erc1155' ? currencyId : undefined, tokenId)
  const token = useToken(!isETH && tokenType === 'erc20' ? currencyId : undefined)
  const token721 = useToken721(!isETH && tokenType === 'erc721' ? currencyId : undefined)
  if (noId) return undefined
  return !!token721 ? token721 : !!token1155 ? token1155 : isETH ? ETHER : token
}

async function checkTokenType(address: string, library: any) {
  const nftContract = getContract(address, ERC721_ABI, library)
  try {
    const res = await nftContract.supportsInterface(interface721[0])
    if (res === true) {
      return 'erc721'
    }
    const res2 = await nftContract.supportsInterface(interface1155[0])
    if (res2 === true) {
      return 'erc1155'
    }
    return 'erc20'
  } catch (e) {
    return 'erc20'
  }
}
