import React, { useMemo } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'
import { WrappedTokenInfo } from 'models/tokenList'
import tokenLogoUriList from 'assets/tokenLogoUriList.json'
import { Token1155 } from 'constants/token/token1155'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { Token721 } from 'constants/token/token721'
import tUSDCImg from 'assets/images/tUSDC.jpg'
import tWETHImg from 'assets/images/tWETH.jpg'
import AiBitcoin from 'assets/images/ai_bitcoin.png'
import { defaultErc721Address } from 'components/Input/CurrencyInputPanel/ERC721List'
import { useIntervalGetToken721 } from 'hooks/useInterval'
import { filter721 } from 'utils/checkIs1155'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  currencySymbol,
  logoUrl
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  currencySymbol?: string
  logoUrl?: string
}) {
  const { chainId } = useActiveWeb3React()
  const _token = currency as any
  const is721 = filter721(currency)

  const { token721 } = useIntervalGetToken721(is721)

  const srcs: string[] = useMemo(() => {
    const uriLocations = currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
    if (!currency && !currencySymbol) {
      return []
    }

    if (_token?.address === defaultErc721Address) {
      return [AiBitcoin]
    }

    if (currency?.symbol === 'ETH') {
      const uri = (tokenLogoUriList as any)[
        SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID]?.nativeCurrency.symbol ?? 'ETH'
      ]
      if (uri) return [uri]
    }

    if (currency?.symbol === 'tUSDC' || currencySymbol === 'tUSDC') {
      return [tUSDCImg]
    }

    if (currency?.symbol === 'USDC' || currencySymbol === 'USDC') {
      return [tUSDCImg]
    }

    if (currency?.symbol === 'tWETH' || currencySymbol === 'tWETH') {
      return [tWETHImg]
    }

    if (currencySymbol) {
      const uri = (tokenLogoUriList as any)[currencySymbol]
      if (uri) return [uri]
    }
    if (!currency) return []

    if (currency instanceof Token1155 || currency instanceof Token721) {
      if (token721?.uri) {
        return [token721.uri]
      }
    }

    if (currency?.symbol) {
      const uri = (tokenLogoUriList as any)[currency.symbol]
      if (uri) return [uri]
    }

    if (currency instanceof Token) {
      let uri = ''
      if (currency?.symbol) {
        uri = (tokenLogoUriList as any)[currency.symbol]
      }

      return [uriLocations, getTokenLogoURL(currency.address), uri]
    }

    return [uriLocations]
  }, [_token?.address, chainId, currency, currencySymbol, token721?.uri])

  return (
    <Logo
      style={{
        ...style,
        width: size,
        height: size,
        borderRadius: size,
        boxShadow: ' 0px 6px 10px rgba(0, 0, 0, 0.075)',
        objectFit: 'cover',
        background: '#ffffff'
      }}
      srcs={logoUrl ? [logoUrl, ...srcs] : srcs}
      alt={`${currency?.symbol ?? 'token'} logo`}
    />
  )
}
