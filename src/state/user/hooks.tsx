import { Pair, Token, ChainId } from '@ladder/sdk'
import { DEFAULT_1155_LIST } from 'constants/default1155List'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'constants/index'
import { Token1155 } from 'constants/token/token1155'
import { useActiveWeb3React } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import flatMap from 'lodash.flatmap'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter1155, filter721 } from 'utils/checkIs1155'
import { generateErc20 } from 'utils/getHashAddress'
import { pairKeyToken, token1155key } from './reducer'
import { AppDispatch, AppState } from '../index'
import {
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserSingleHopOnly,
  updateUserDarkMode,
  addSerializedToken,
  removeSerializedToken,
  // SerializedPair,
  addSerializedPair,
  SerializedToken,
  addSerializedToken1155,
  removeSerializedToken1155,
  addSerializedToken721,
  updateUserERC20ApproveMode,
  updateUserTransactionSpeed
} from './actions'
import { NFT } from 'models/allTokens'
import { DEFAULT_721_LIST } from 'constants/default721List'
import { Token721 } from 'constants/token/token721'

function serializeToken(token: Token | Token1155): SerializedToken {
  const is721 = filter721(token)
  const is1155 = filter1155(token)
  return is721
    ? {
        chainId: token.chainId,
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        tokenId: is721.tokenId ?? '',
        standard: 'erc721'
      }
    : is1155
    ? {
        chainId: token.chainId,
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        tokenId: is1155.tokenId,
        standard: 'erc1155'
      }
    : {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        standard: 'erc20'
      }
}

function deserializeToken(serializedToken: SerializedToken): Token | Token1155 {
  const hasTokenId = serializedToken?.tokenId
  return serializedToken.standard === 'erc721'
    ? new Token721(serializedToken.chainId, serializedToken.address, hasTokenId, {
        name: serializedToken.name,
        symbol: serializedToken.symbol
      })
    : serializedToken.standard === 'erc1155'
    ? new Token1155(serializedToken.chainId, serializedToken.address, serializedToken.tokenId ?? 0, {
        name: serializedToken.name,
        symbol: serializedToken.symbol
      })
    : new Token(
        serializedToken.chainId,
        serializedToken.address,
        serializedToken.decimals ?? 18,
        serializedToken.symbol,
        serializedToken.name
      )
}

/* function deserialize1155Token(serializedToken1155: SerializedToken1155): Token1155 {
  return new Token1155(serializedToken1155.chainId, serializedToken1155.address, serializedToken1155.tokenId, {
    name: serializedToken1155.name,
    symbol: serializedToken1155.symbol
  })
} */

export function useIsDarkMode(): boolean {
  // const { userDarkMode } = useSelector<AppState, { userDarkMode: boolean | null }>(({ user: { userDarkMode } }) => ({
  //   userDarkMode
  // }))
  return true
  // return userDarkMode ?? false
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode())
  }, [dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>(state => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useIsERC20ApproveAllMode(): boolean {
  return useSelector<AppState, AppState['user']['userERC20ApproveAllMode']>(state => state.user.userERC20ApproveAllMode)
}

export function useERC20ApproveModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const isERC20ApproveAllMode = useIsERC20ApproveAllMode()

  const toggleUserERC20ApproveMode = useCallback(() => {
    dispatch(updateUserERC20ApproveMode({ userERC20ApproveAllMode: !isERC20ApproveAllMode }))
  }, [dispatch, isERC20ApproveAllMode])

  return [isERC20ApproveAllMode, toggleUserERC20ApproveMode]
}

export function useUserTransactionSpeed(): [number, (userTransactionSpeed: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userTransactionSpeed = useSelector<AppState, AppState['user']['userTransactionSpeed']>(state => {
    return state.user.userTransactionSpeed
  })

  const setUserTransactionSpeed = useCallback(
    (userTransactionSpeed: number) => {
      dispatch(updateUserTransactionSpeed({ userTransactionSpeed }))
    },
    [dispatch]
  )

  return [userTransactionSpeed, setUserTransactionSpeed]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()

  const singleHopOnly = useSelector<AppState, AppState['user']['userSingleHopOnly']>(
    state => state.user.userSingleHopOnly
  )

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch]
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>(state => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
    },
    [dispatch]
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}

// add user token erc20,erc1155
export function useAddUserToken(): (token: Token | NFT) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    token => {
      const token1155 = filter1155(token)
      const token721 = filter721(token)
      if (token721) {
        dispatch(addSerializedToken721({ serializedToken: serializeToken(token721) }))
        return
      }
      if (token1155) {
        dispatch(addSerializedToken1155({ serializedToken: serializeToken(token1155) }))
        return
      }
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

// remove user token erc20,erc1155
export function useRemoveUserAddedToken(): (chainId: number, token: Token | NFT) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId, token) => {
      const token1155 = filter1155(token)
      if (token1155) {
        dispatch(removeSerializedToken1155({ chainId, address: token.address, tokenId: token1155?.tokenId ?? '' }))
        return
      }
      dispatch(removeSerializedToken({ chainId, address: token.address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useUserAddedTokens1155(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['token1155s']>(
    ({ user: { token1155s } }) => token1155s
  )

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

export function useUserAddedTokens721(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['token721s']>(
    ({ user: { token721s } }) => token721s
  )

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(item => deserializeToken(item))
  }, [serializedTokensMap, chainId])
}
// function serializePair(pair: Pair): SerializedPair {
//   return {
//     token0: serializeToken(pair.token0),
//     token1: serializeToken(pair.token1)
//   }
// }

// export function usePairAdder(): (pair: Pair) => void {
//   const dispatch = useDispatch<AppDispatch>()

//   return useCallback(
//     (pair: Pair) => {
//       dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
//     },
//     [dispatch]
//   )
// }

export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(
    tokenA.chainId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Pair.getAddress(generateErc20(tokenA)!, generateErc20(tokenB)!),
    18,
    'LADDER-LP',
    'Ladder Lquidity Provider'
  )
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()
  const nfts = useTrackedToken1155List()
  const erc721s = useTrackedToken721List()
  const userTokens = useUserAddedTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), tokenAddress => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (
                nfts
                  ? (nfts as any[])
                      .concat(erc721s)
                      .concat(userTokens)
                      .concat(BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                  : [...(BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? []), userTokens]
              )
                // to construct pairs of the given token with each base
                .map((base: Token) => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p: Token[] | null): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [chainId, tokens, nfts, erc721s, userTokens]
  )
  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map(pairId => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs]
  )
  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token | Token1155, Token | Token1155] }>(
      (memo, [tokenA, tokenB]) => {
        const sorted = tokenA.sortsBefore(tokenB)
        const key = sorted ? pairKeyToken(tokenA, tokenB) : pairKeyToken(tokenB, tokenA)
        if (memo[key]) return memo
        memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
        return memo
      },
      {}
    )

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}

export function useTokenPairAdder(): (
  token0: Token | Token1155 | undefined,
  token1: Token | Token1155 | undefined
) => void {
  const dispatch = useDispatch<AppDispatch>()
  const allPairs = useTrackedTokenPairs()

  return useCallback(
    (token0: Token | Token1155 | undefined, token1: Token | Token1155 | undefined) => {
      if (!token0 || !token1) return

      const filtered = allPairs.filter(([tokenA, tokenB]) => {
        if (tokenA.address === token0.address && tokenB.address === token1.address) {
          if (
            filter1155(tokenA)?.tokenId === filter1155(token0)?.tokenId &&
            filter1155(tokenB)?.tokenId === filter1155(token1)?.tokenId
          ) {
            return true
          }
        }
        if (tokenB.address === token0.address && tokenA.address === token1.address) {
          if (
            filter1155(tokenB)?.tokenId === filter1155(token0)?.tokenId &&
            filter1155(tokenA)?.tokenId === filter1155(token1)?.tokenId
          ) {
            return true
          }
        }
        return false
      })

      if (filtered.length === 0) {
        dispatch(
          addSerializedPair({
            serializedPair: {
              token0: serializeToken(token0),
              token1: serializeToken(token1)
            }
          })
        )
      }
    },
    [allPairs, dispatch]
  )
}

export function useTrackedToken1155List(): Token1155[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['token1155s']>(
    ({ user: { token1155s } }) => token1155s
  )

  const userList: Token1155[] = useMemo(() => {
    if (!chainId || !serializedTokensMap) return []
    const forChain = serializedTokensMap[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map(idx => {
      return deserializeToken(forChain[idx]) as Token1155
    })
  }, [serializedTokensMap, chainId])

  const combinedList = useMemo(
    () => (chainId ? userList.concat(DEFAULT_1155_LIST[chainId] ?? []) : []),
    [userList, chainId]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: Token1155 }>((memo, token) => {
      const key = token1155key(token.address, token.tokenId)
      if (memo[key]) return memo
      memo[key] = token
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}

export function useTrackedToken721List(): Token721[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['token721s']>(
    ({ user: { token721s } }) => token721s
  )

  const userList: Token721[] = useMemo(() => {
    if (!chainId || !serializedTokensMap) return []
    const forChain = serializedTokensMap[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map(idx => {
      return deserializeToken(forChain[idx]) as Token721
    })
  }, [serializedTokensMap, chainId])

  const combinedList = useMemo(
    () => (chainId ? userList.concat(DEFAULT_721_LIST[chainId] ?? []) : []),
    [userList, chainId]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: Token721 }>((memo, token) => {
      const key = token.address
      if (memo[key]) return memo
      memo[key] = token
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}
