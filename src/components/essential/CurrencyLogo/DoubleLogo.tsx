import { styled } from '@mui/material'
import CurrencyLogo from '.'
import { AllTokens } from 'models/allTokens'

const Wrapper = styled('div')({
  position: 'relative',
  flexDirection: 'row',
  display: 'flex'
})

interface DoubleCurrencyLogoProps {
  margin?: string
  size?: number
  currency0?: AllTokens
  currency1?: AllTokens
}

export default function DoubleCurrencyLogo({ currency0, currency1, size = 24, margin }: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sx={{ marginRight: margin, width: (size * 14) / 8, height: size }}>
      {currency0 && <CurrencyLogo currency={currency0} size={size.toString() + 'px'} />}
      {currency1 && (
        <CurrencyLogo
          currency={currency1}
          size={size.toString() + 'px'}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 2
          }}
        />
      )}
    </Wrapper>
  )
}
