import { useMemo, useState, useEffect } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import ERC21155_ABI from 'constants/abis/erc1155.json'
import ERC2721_ABI from 'constants/abis/erc721.json'
import { use1155Contract, use721Contract, useMulticallContract } from '../../hooks/useContract'
import { getContract, isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData, useSingleCallResult } from '../multicall/hooks'
import { Currency, ETHER, Token, JSBI, CurrencyAmount, TokenAmount, ChainId } from '@ladder/sdk'
import { useActiveWeb3React } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { Token1155 } from 'constants/token/token1155'
import { checkIs1155, checkIs721, filter721 } from 'utils/checkIs1155'
import { useBlockNumber } from 'state/application/hooks'
import { Token721 } from 'constants/token/token721'
import { getTest721uriWithIndex, isTest721 } from 'constants/default721List'
import { axiosNftScanInstance, erc721CollectionResponseType, ResponseType } from 'utils/axios'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined
} {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const arg = useMemo(() => [address], [address])

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', arg)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  const is1155 = checkIs1155(currency)
  const is721 = checkIs721(currency)
  const token1155Balance = useToken1155Balance(is1155 ? (currency as Token1155) : undefined)

  const token721Balance = useToken721Balance(is721 ? (currency as Token721) : undefined)

  const balances = useCurrencyBalances(is1155 || is721 ? undefined : account, [currency])[0]

  return is721 ? token721Balance : is1155 ? token1155Balance : balances
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return useMemo(() => balances ?? {}, [balances])
}

export function useToken1155Balances(tokens?: Token1155[] | null | undefined) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [balances, setBalances] = useState<TokenAmount[] | undefined>(undefined)
  const { account, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()

  const calls = useMemo(() => {
    if (!tokens || !library) return undefined
    return Promise.all(
      tokens.map(({ tokenId, address }) => {
        const contract = getContract(address, ERC21155_ABI, library, account ?? undefined)
        if (!contract) return undefined
        return contract.balanceOf(account, tokenId)
      })
    )
  }, [account, library, tokens])

  useEffect(() => {
    ;(async () => {
      setError(undefined)
      setLoading(true)
      try {
        const callRes = await calls

        setLoading(false)

        const res = tokens?.map((token, idx) => new TokenAmount(token, callRes?.[idx]?.toString() ?? '0'))
        setBalances(res)
      } catch (e: any) {
        setLoading(false)
        setError(e.message)
        console.error(e.message)
        setBalances(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, blockNumber, tokens])

  return { loading, error, balances }
}

export function useToken1155Balance(token?: Token1155 | null | undefined) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    return [account ?? undefined, token?.tokenId]
  }, [account, token?.tokenId])

  const contract = use1155Contract(token?.address ? token.address : undefined)
  const balance = useSingleCallResult(contract, 'balanceOf', args)

  const amount = useMemo(() => {
    return token && balance.result ? new TokenAmount(token, balance.result[0]?.toString()) : undefined
  }, [balance.result, token])

  return amount
}

export function useToken721Balances(tokens?: Token721[] | null | undefined) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [balances, setBalances] = useState<TokenAmount[] | undefined>(undefined)
  const { account, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()

  const calls = useMemo(() => {
    if (!tokens || !library) return undefined
    return Promise.all(
      tokens.map(({ address }) => {
        const contract = getContract(address, ERC2721_ABI, library, account ?? undefined)
        if (!contract) return undefined
        return contract.balanceOf(account)
      })
    )
  }, [account, library, tokens])

  useEffect(() => {
    ;(async () => {
      setError(undefined)
      setLoading(true)
      try {
        const callRes = await calls

        setLoading(false)

        const res = tokens?.map((token, idx) => new TokenAmount(token, callRes?.[idx]?.toString() ?? '0'))
        setBalances(res)
      } catch (e: any) {
        setLoading(false)
        setError(e.message)
        console.error(e.message)
        setBalances(undefined)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, blockNumber, tokens])

  return { loading, error, balances }
}

export function useToken721Balance(token?: Token721 | null | undefined) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    return [account ?? undefined]
  }, [account])

  const contract = use721Contract(token && isAddress(token?.address) ? token?.address : undefined)
  const balance = useSingleCallResult(token && account ? contract : null, 'balanceOf', args)

  const amount = useMemo(() => {
    return token && balance.result ? new TokenAmount(token, balance.result[0]?.toString()) : undefined
  }, [balance.result, token])

  return amount
}

export function useToken721BalanceTokens(tokenAmount?: TokenAmount): {
  loading: boolean
  availableTokens: undefined | Array<Token721> | undefined
} {
  const { account, chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [tokens, setTokens] = useState<Token721[] | undefined>(undefined)

  // const contract = use721Contract(isAddress(tokenAmount?.token?.address) ? tokenAmount?.token?.address : undefined)

  // const calls = useMemo(() => {
  //   const balance = tokenAmount?.toExact()

  //   if (!balance || !account || !contract) return

  //   const total = parseInt(balance)
  //   const arr = Array.from(Array(total).keys()).map((_, idx) => {
  //     return contract.tokenOfOwnerByIndex(account, idx)
  //   })
  //   return arr
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account, contract, tokenAmount?.toExact()])

  useEffect(() => {
    if (!chainId || !tokenAmount?.raw || !account || !tokenAmount?.token?.address) {
      return
    }
    ;(async () => {
      setLoading(true)
      try {
        const res = await axiosNftScanInstance.get<ResponseType<erc721CollectionResponseType>>(
          `account/own/${account}`,
          {
            params: { erc_type: 'erc721', contract_address: tokenAmount?.token?.address }
          }
        )
        if (res?.data?.data?.total > 0) {
          const token721 = filter721(tokenAmount.token)
          const tokens = res.data.data.content.map(
            data =>
              new Token721(chainId, data.contract_address, data.token_id, {
                name: tokenAmount?.token?.name ?? data.name ?? data.contract_name,
                symbol: tokenAmount?.token?.symbol ?? data.contract_name,
                tokenUri: token721?.tokenUri,
                uri:
                  ChainId.SEPOLIA && isTest721(tokenAmount.token.address) && token721?.uri
                    ? getTest721uriWithIndex(token721.uri, data.token_id ? parseInt(data.token_id) : 1)
                    : data.image_uri ?? undefined
              })
          )
          setTokens(tokens)
        }
        // const indexes = await Promise.all(calls)
        // const token721 = filter721(tokenAmount.token)
        // const tokens = indexes.map(
        //   id =>
        //     new Token721(chainId, tokenAmount.token.address, id.toString(), {
        //       name: tokenAmount.token.name,
        //       symbol: tokenAmount.token.symbol,
        //       tokenUri: token721?.tokenUri,
        //       uri:
        //         chainId === ChainId.SEPOLIA && isTest721(tokenAmount.token.address) && token721?.uri
        //           ? getTest721uriWithIndex(token721.uri, id)
        //           : undefined
        //     })
        // )

        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.error('cannot get 721 available ids')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, tokenAmount?.toExact()])

  const res = useMemo(() => {
    return { loading, availableTokens: tokens }
  }, [loading, tokens])

  return res
}

export function useTokenTotalSupplies(tokens?: (Token | undefined)[]): {
  [tokenAddress: string]: TokenAmount | undefined
} {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'totalSupply')

  return useMemo(() => {
    return validatedTokens.length > 0
      ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
          const value = balances?.[i]?.result?.[0]
          const amount = value ? JSBI.BigInt(value.toString()) : undefined
          if (amount) {
            memo[token.address] = new TokenAmount(token, amount)
          }
          return memo
        }, {})
      : {}
  }, [validatedTokens, balances])
}

export function useTokenTotalSupply(tokens?: Token | undefined) {
  const arg = useMemo(() => [tokens], [tokens])

  const result = useTokenTotalSupplies(arg)

  return useMemo(() => {
    return result[tokens?.address as keyof typeof result]
  }, [result, tokens?.address])
}
