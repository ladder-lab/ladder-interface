import { TokenAmount, Pair, Currency } from '@uniswap/sdk'
import { useMemo } from 'react'
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { generateErc20 } from 'utils/getHashAddress'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI.abi)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => {
        return [generateErc20(wrappedCurrency(currencyA, chainId)), generateErc20(wrappedCurrency(currencyB, chainId))]
      }),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const wrappedA = wrappedCurrency(currencies[i][0], chainId)
      const wrappedB = wrappedCurrency(currencies[i][1], chainId)
      const [token0, token1] =
        wrappedA && wrappedB && wrappedA.sortsBefore(wrappedB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      ]
    })
  }, [chainId, currencies, results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const arg: [Currency | undefined, Currency | undefined][] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(arg)[0]
}
