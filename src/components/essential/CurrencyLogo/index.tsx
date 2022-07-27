import React, { useMemo } from 'react'
import Logo from './LogoBase'
import { Currency } from '../../../constants/token/currency'
import { Token } from '../../../constants/token/token'
import useHttpLocations from 'hooks/useHttpLocations'
import { WrappedTokenInfo } from 'models/tokenList'
import tokenLogoUriList from 'assets/tokenLogoUriList.json'
import { Token1155 } from 'constants/token/token1155'

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  currencySymbol
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  currencySymbol?: string
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const srcs: string[] = useMemo(() => {
    if (!currency && !currencySymbol) {
      return []
    }

    if (currency instanceof Token1155) {
      if (currency.uri) {
        return [currency.uri]
      }
    }

    if (currencySymbol) {
      const uri = (tokenLogoUriList as any)[currencySymbol]
      if (uri) return [uri]
    }

    if (currency instanceof Token) {
      let uri = ''
      if (currency?.symbol) {
        uri = (tokenLogoUriList as any)[currency.symbol]
      }
      return [...uriLocations, getTokenLogoURL(currency.address), uri]
    }

    if (currency?.symbol) {
      const uri = (tokenLogoUriList as any)[currency.symbol]
      if (uri) return [uri]
    }

    return []
  }, [currency, currencySymbol, uriLocations])

  return (
    <Logo
      style={{
        ...style,
        width: size,
        height: size,
        borderRadius: size,
        boxShadow: ' 0px 6px 10px rgba(0, 0, 0, 0.075)'
      }}
      srcs={srcs}
      alt={`${currency?.symbol ?? 'token'} logo`}
    />
  )
}
