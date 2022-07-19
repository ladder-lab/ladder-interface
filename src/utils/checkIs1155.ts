import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'

export function checkIs1155(token: AllTokens | null | undefined) {
  return token && token instanceof Token1155 && token.is1155 == true
}
