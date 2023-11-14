import { useEffect, useMemo, useState } from 'react'
import { useTokenContract, use1155Contract, use721Contract } from './useContract'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { isAddress } from 'utils'

export function useTokenTypeCallback(tokenContract: string | undefined, IsDisplay?: boolean) {
  const Erc20Contract = useTokenContract(isAddress(tokenContract) ? tokenContract : undefined)
  const Erc1155Contract = use1155Contract(isAddress(tokenContract) ? tokenContract : undefined)
  const Erc721Contract = use721Contract(isAddress(tokenContract) ? tokenContract : undefined)
  const [isErc20, setIsErc20] = useState<boolean>(false)
  const [isErc721, setIsErc721] = useState<boolean>(false)
  const [isEr1155, setIsErc1155] = useState<boolean>(false)

  useEffect(() => {
    if (!isAddress(tokenContract) && IsDisplay) return

    const fetchTokenErc20 = async () => {
      try {
        const decimals = await Erc20Contract?.decimals()
        console.log('🚀 ~ decimals:', decimals)
        setIsErc20(!!decimals)
      } catch (error) {
        console.error('Erc20-error', error)
        setIsErc20(false)
      }
    }

    const fetchErc1155 = async () => {
      try {
        const IsErc1155 = await Erc1155Contract?.supportsInterface(0xd9b67a26)
        console.log('🚀 ~ IsErc1155:', IsErc1155)
        setIsErc1155(IsErc1155)
      } catch (error) {
        console.error('Erc1155-error', error)
        setIsErc1155(false)
      }
    }

    const fetchErc721 = async () => {
      try {
        const IsErc721 = await Erc721Contract?.supportsInterface(0x80ac58cd)
        console.log('🚀 ~ IsErc721:', IsErc721)
        setIsErc721(IsErc721)
      } catch (error) {
        setIsErc721(false)
        console.error('Erc1721-error', error)
      }
    }
    Promise.all([fetchTokenErc20(), fetchErc1155(), fetchErc721()])
  }, [Erc20Contract, Erc1155Contract, Erc721Contract, tokenContract, IsDisplay])

  return useMemo(() => {
    if ((isErc20 && isAddress(tokenContract)) || IsDisplay) return Mode.ERC20
    if (isErc721 && isAddress(tokenContract)) return Mode.ERC721
    if (isEr1155 && isAddress(tokenContract)) return Mode.ERC1155
    return undefined
  }, [IsDisplay, isEr1155, isErc20, isErc721, tokenContract])
}

export function Erc20Token(tokenContract: string | undefined) {
  const Erc20Contract = useTokenContract(isAddress(tokenContract) ? tokenContract : undefined)
  const [decimals, setDecimals] = useState<number>()
  const [symbol, setSymbol] = useState<string>()
  const [name, setName] = useState<string>()

  useEffect(() => {
    if (!isAddress(tokenContract)) return

    const TokenErc20Decimals = async () => {
      try {
        const decimals = await Erc20Contract?.decimals()
        setDecimals(decimals)
      } catch (error) {
        console.error('Erc20-error', error)
      }
    }

    const TokenErc20Symbol = async () => {
      try {
        const symbol = await Erc20Contract?.symbol()
        setSymbol(symbol)
      } catch (error) {
        console.error('Erc1155-error', error)
      }
    }

    const TokenErc20Name = async () => {
      try {
        const name = await Erc20Contract?.name()
        setName(name)
      } catch (error) {
        console.error('Erc1721-error', error)
      }
    }
    Promise.all([TokenErc20Decimals(), TokenErc20Symbol(), TokenErc20Name()])
  }, [Erc20Contract, tokenContract])

  return {
    decimals,
    symbol,
    name
  }
}
