import { ChangeEvent, useCallback } from 'react'
import { styled, Box, useTheme, Typography, Button } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import SelectButton from 'components/Button/SelectButton'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Currency } from 'constants/token/currency'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface Props {
  currency?: Currency | null
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMax?: () => void
  disabled?: boolean
  placeholder?: string
  selectActive?: boolean
  inputFocused?: boolean
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  onSelectCurrency: (cur: Currency) => void
}

const InputRow = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 60,
  display: 'flex',
  justifyContent: 'flex-end',
  maxWidth: 254,
  '& .Mui-focused': {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'calc(100% + 2px)',
      height: 'calc(100% + 2px)',
      borderRadius: 14,
      margin: -1,
      border: '1px solid ' + theme.palette.primary.main,
      zIndex: 10000
    }
  }
}))

const StyledInput = styled(InputNumerical)({
  position: 'absolute'
})

const ButtonWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 196,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    right: 20
  }
}))

export default function CurrencyInputPanel({
  onMax,
  value,
  disabled,
  placeholder,
  selectActive,
  inputFocused,
  disableCurrencySelect,
  currency,
  onSelectCurrency,
  hideBalance,
  onChange
}: Props) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { showModal } = useModal()
  const theme = useTheme()

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(<SelectCurrencyModal onSelectCurrency={onSelectCurrency} />)
    }
  }, [disableCurrencySelect, onSelectCurrency, showModal])

  return (
    <Box display="flex" gap={16} width="100%" alignItems={'flex-start'}>
      {/* <InputLabel>Token</InputLabel> */}
      <SelectButton width={'346px'} onClick={showCurrencySearch} disabled={disabled} primary={selectActive}>
        {currency ? <LogoText logo={<CurrencyLogo currency={currency} />} text={currency.symbol} /> : <>Select Token</>}
      </SelectButton>
      <Box flexGrow={1}>
        <InputRow>
          <StyledInput
            placeholder={placeholder ?? 'Enter amount to swap'}
            value={value.toString()}
            onChange={onChange}
            type={'number'}
            disabled={disabled}
            focused={inputFocused}
          />
          {currency && onMax && (
            <ButtonWrapper>
              <Button variant="outlined" sx={{ width: '64px', height: '28px', borderRadius: '20px' }} onClick={onMax}>
                Max
              </Button>
            </ButtonWrapper>
          )}
        </InputRow>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontSize={12} mt={12} sx={{ color: theme.palette.text.secondary }}>
            ~$568.23
          </Typography>
          <Typography fontSize={12} mt={12} sx={{ color: theme.palette.text.secondary }}>
            Balance:{' '}
            {!hideBalance && !!currency && selectedCurrencyBalance ? selectedCurrencyBalance?.toSignificant(6) : ' -'}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
