import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'

export function checkIs1155(token: AllTokens | null | undefined) {
  return token && token instanceof Token1155 && token.is1155 == true
}

export function filter1155(token: AllTokens | null | undefined) {
  if (token && token instanceof Token1155 && token.is1155 == true) {
    return token
  }
  return undefined
}

export function getTokenText(token1: AllTokens | undefined, token2: AllTokens | undefined) {
  if (!token1 || !token2) {
    return { token1Text: '', token2Text: '', token1Is1155: false }
  }
  const token1Is1155 = checkIs1155(token1)
  const token1Text = token1Is1155 ? token1?.name : token1?.symbol
  const token2Text = token1Is1155 ? token2?.symbol : token2?.name

  return {
    token1Text,
    token2Text,
    token1Is1155,
    token1Id: filter1155(token1)?.tokenId ?? '',
    token2Id: filter1155(token2)?.tokenId ?? ''
  }
}
