import { Typography } from '@mui/material'
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

export function getTokenText(token1: AllTokens | undefined, token2?: AllTokens | undefined) {
  if (!token1) {
    return { Token1Text: '', Token2Text: '', token1Is1155: false, token2Is1155: false, toke1Text: '', token2Text: '' }
  }

  const token1Is1155 = checkIs1155(token1)
  const token1Text = token1Is1155 ? token1?.name + ' #' + (token1 as Token1155).tokenId ?? '-' : token1?.symbol
  const Token1Text = token1Is1155
    ? ({ fontSize, color }: { fontSize?: string | number; color?: string | undefined }) => (
        <Typography component="span" color={color ?? 'primary'} fontSize={fontSize}>
          {token1?.name + ' #' + (token1 as Token1155).tokenId ?? '-'}{' '}
        </Typography>
      )
    : () => token1Text

  if (!token2) {
    return {
      Token1Text,
      Token2Text: () => null,
      token1Is1155: token1Is1155,
      token2Is1155: false,
      token1Id: filter1155(token1)?.tokenId ?? '',
      token1Text,
      token2Text: '',
      token2Id: ''
    }
  }
  const token2Is1155 = checkIs1155(token2)
  const token2Text = token2Is1155 ? token2?.name + ' #' + (token2 as Token1155).tokenId ?? '-' : token2?.symbol
  const Token2Text = token2Is1155
    ? ({ fontSize, color }: { fontSize?: string | number; color?: string | undefined }) => (
        <Typography component="span" color={color ?? 'primary'} fontSize={fontSize}>
          {token2?.name + ' #' + (token2 as Token1155).tokenId ?? '-'}{' '}
        </Typography>
      )
    : () => <> {token2Text}</>

  return {
    token1Text,
    token2Text,
    Token1Text,
    Token2Text,
    token2Is1155,
    token1Is1155,
    token1Id: filter1155(token1)?.tokenId ?? '',
    token2Id: filter1155(token2)?.tokenId ?? ''
  }
}
