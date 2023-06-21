import { ChainId } from '@ladder/sdk'
import { NETWORK_CHAIN_ID, SUPPORTED_NETWORKS } from 'constants/chain'
import { AllTokens } from 'models/allTokens'

export function getSymbol(token: AllTokens | undefined, chainId?: ChainId | null) {
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
