import { ChangeEvent, useCallback } from 'react'
import { styled, Box, useTheme, Typography, Button } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import SelectButton from 'components/Button/SelectButton'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance, useToken1155Balance } from 'state/wallet/hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { AllTokens, TokenType } from 'models/allTokens'
import { checkIs1155 } from 'utils/checkIs1155'
import { Token1155 } from 'constants/token/token1155'
import useBreakpoint from 'hooks/useBreakpoint'

interface Props {
  currency?: AllTokens | null
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?: string
  selectActive?: boolean
  inputFocused?: boolean
  disableCurrencySelect?: boolean
  onSelectCurrency: (cur: AllTokens) => void
  selectedTokenType?: TokenType
}

const InputRow = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 60,
  display: 'flex',
  justifyContent: 'flex-end',
  // maxWidth: 254,
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
  position: 'absolute',
  width: '100%'
})

export default function CurrencyInputPanel({
  value,
  disabled,
  placeholder,
  selectActive,
  inputFocused,
  disableCurrencySelect,
  currency,
  onSelectCurrency,
  onChange,
  selectedTokenType
}: Props) {
  const { account } = useActiveWeb3React()
  const is1155 = checkIs1155(currency)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency && !is1155 ? currency : undefined)

  const token1155Balance = useToken1155Balance(is1155 ? (currency as Token1155) : undefined)

  const { showModal } = useModal()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(<SelectCurrencyModal onSelectCurrency={onSelectCurrency} selectedTokenType={selectedTokenType} />)
    }
  }, [disableCurrencySelect, onSelectCurrency, selectedTokenType, showModal])

  const handleMax = useCallback(() => {
    if (!selectedCurrencyBalance && !token1155Balance) return
    onChange({
      target: { value: is1155 ? token1155Balance : selectedCurrencyBalance?.toExact() ?? '0' }
    } as ChangeEvent<HTMLInputElement>)
  }, [is1155, onChange, selectedCurrencyBalance, token1155Balance])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'row'
        },
        gap: {
          xs: 12,
          md: 16
        }
      }}
    >
      {/* <InputLabel>Token</InputLabel> */}
      <SelectButton
        width={isDownMd ? '100%' : '346px'}
        onClick={showCurrencySearch}
        disabled={disabled}
        primary={selectActive}
      >
        {currency ? (
          <LogoText
            logo={<CurrencyLogo currency={currency} />}
            text={checkIs1155(currency) ? currency.name : currency.symbol}
          />
        ) : (
          <>Select Token</>
        )}
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
        </InputRow>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={9}>
          <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}>
            ~$568.23
          </Typography>
          <Box display="flex" alignItems={'center'}>
            <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}>
              Balance: {!!currency && selectedCurrencyBalance ? selectedCurrencyBalance?.toSignificant(6) : ''}
              {!!currency && token1155Balance ? token1155Balance : ''}
              {!selectedCurrencyBalance && !token1155Balance && '-'}
            </Typography>
            {currency && (
              <Button
                variant="text"
                sx={{ fontSize: 12, minWidth: 'unset', width: 'max-content', height: 'max-content', padding: '0 10px' }}
                onClick={handleMax}
              >
                MAX
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
