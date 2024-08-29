import { useEffect, useMemo, useState } from 'react'
import { useTokenContract, use1155Contract, use721Contract } from './useContract'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { isAddress } from 'utils'

export function useTokenTypeCallback(tokenContract: string | undefined, IsDisplay?: boolean) {
  console.log(tokenContract)
  const Erc20Contract = useTokenContract(isAddress(tokenContract) ? tokenContract : undefined)
  const Erc1155Contract = use1155Contract(isAddress(tokenContract) ? tokenContract : undefined)
  const Erc721Contract = use721Contract(isAddress(tokenContract) ? tokenContract : undefined)
  const [isErc20, setIsErc20] = useState<boolean>(false)
  const [isErc721, setIsErc721] = useState<boolean>(false)
  const [isErc1155, setIsErc1155] = useState<boolean>(false)
  useEffect(() => {
    if (!isAddress(tokenContract) && IsDisplay) return

    const fetchTokenData = async () => {
      const results = await Promise.allSettled([
        Erc20Contract?.decimals()
          .then((decimals: any) => setIsErc20(!!decimals))
          .catch(() => setIsErc20(false)),
        Erc1155Contract?.supportsInterface(0xd9b67a26)
          .then((isErc1155: any) => setIsErc1155(!!isErc1155))
          .catch(() => setIsErc1155(false)),
        Erc721Contract?.supportsInterface(0x80ac58cd)
          .then((isErc721: any) => setIsErc721(!!isErc721))
          .catch(() => setIsErc721(false))
      ])

      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error('Token fetch error', result.reason)
        }
      })
    }

    fetchTokenData()
  }, [Erc20Contract, Erc1155Contract, Erc721Contract, tokenContract, IsDisplay])

  return useMemo(() => {
    if ((isErc20 && isAddress(tokenContract)) || IsDisplay) return Mode.ERC20
    if (isErc721 && isAddress(tokenContract)) return Mode.ERC721
    if (isErc1155 && isAddress(tokenContract)) return Mode.ERC1155
    return undefined
  }, [IsDisplay, isErc1155, isErc20, isErc721, tokenContract])
}

const useTokenDetails = (tokenContract: string | undefined, contractType: 'erc20' | 'erc721' | 'erc1155') => {
  const validAddress = isAddress(tokenContract) ? tokenContract : undefined
  const Erc20Contract = useTokenContract(validAddress)
  const Erc1155Contract = use1155Contract(validAddress)
  const Erc721Contract = use721Contract(validAddress)

  const contract = useMemo(() => {
    switch (contractType) {
      case 'erc20':
        return Erc20Contract
      case 'erc721':
        return Erc721Contract
      case 'erc1155':
        return Erc1155Contract
      default:
        return undefined
    }
  }, [contractType, Erc20Contract, Erc1155Contract, Erc721Contract])

  const [symbol, setSymbol] = useState<string>()
  const [name, setName] = useState<string>()
  const [decimals, setDecimals] = useState<number>()

  useEffect(() => {
    if (!validAddress) return

    const fetchTokenDetails = async () => {
      const results = await Promise.allSettled([
        contractType === 'erc20'
          ? contract
              ?.decimals()
              .then(setDecimals)
              .catch(() => setDecimals(undefined))
          : Promise.resolve(),
        contract
          ?.symbol()
          .then(setSymbol)
          .catch(() => setSymbol(undefined)),
        contract
          ?.name()
          .then(setName)
          .catch(() => setName(undefined))
      ])

      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error(`${contractType} fetch error`, result.reason)
        }
      })
    }

    fetchTokenDetails()
  }, [contract, validAddress, contractType])

  return { symbol, name, decimals }
}

export const Erc20Token = (tokenContract: string | undefined) => useTokenDetails(tokenContract, 'erc20')
export const Erc721Token = (tokenContract: string | undefined) => useTokenDetails(tokenContract, 'erc721')
export const Erc1155Token = (tokenContract: string | undefined) => useTokenDetails(tokenContract, 'erc1155')
