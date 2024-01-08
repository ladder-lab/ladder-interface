import { ChainId } from '@ladder/sdk'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { AllTokens } from 'models/allTokens'
import { checkIs721 } from './checkIs1155'

const names = {
  ['0xE684c11F6E90905EF63B16A4FAD3851AC8f432Be'.toLowerCase()]: 'AIBTC'
}

export function getSymbol(token: AllTokens | undefined, chainId?: ChainId | null) {
  const is721 = checkIs721(token)
  const _token: any = token
  if (is721 && _token?.address && names[_token?.address]) {
    return names[_token?.address]
  }

  return token
    ? token.symbol === 'ETH'
      ? SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID]?.nativeCurrency.symbol
      : token.symbol
    : ''
}

export function getName(token: AllTokens | undefined, chainId?: ChainId | null) {
  return token
    ? token.symbol === 'ETH'
      ? SUPPORTED_NETWORKS[chainId ?? NETWORK_CHAIN_ID]?.nativeCurrency.name
      : token.name
    : ''
}
