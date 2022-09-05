import { ChangeEvent, useCallback } from 'react'
import { Box, useTheme, Typography, Button } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import SelectButton from 'components/Button/SelectButton'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { AllTokens, Token721, TokenType } from 'models/allTokens'
import { checkIs1155 } from 'utils/checkIs1155'
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
  onSelectCurrency?: (cur: AllTokens) => void
  selectedTokenType?: TokenType
  onMax?: () => void
  disableInput?: boolean
  hideBalance?: boolean
  onSelectSubTokens?: (tokens: Token721[]) => void
}

const trimBalance = (balance: string) => {
  if (balance.length > 11) {
    const str = balance.slice(0, 10)
    return str + '...'
  }
  return balance
}

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
  selectedTokenType,
  onMax,
  disableInput,
  hideBalance,
  onSelectSubTokens
}: Props) {
  const { account } = useActiveWeb3React()
  const is1155 = checkIs1155(currency)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const { showModal } = useModal()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(
        <SelectCurrencyModal
          onSelectCurrency={onSelectCurrency}
          selectedTokenType={selectedTokenType}
          onSelectSubTokens={onSelectSubTokens}
        />
      )
    }
  }, [disableCurrencySelect, showModal, onSelectCurrency, selectedTokenType, onSelectSubTokens])

  // const handleMax = useCallback(() => {
  //   if (!selectedCurrencyBalance && !token1155Balance) return
  //   onChange({
  //     target: { value: is1155 ? token1155Balance : selectedCurrencyBalance?.toExact() ?? '0' }
  //   } as ChangeEvent<HTMLInputElement>)
  // }, [is1155, onChange, selectedCurrencyBalance, token1155Balance])

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
        disabled={disableCurrencySelect || disabled}
        primary={selectActive}
        height={isDownMd ? '48px' : '52px'}
        selected={!!currency}
      >
        {currency ? (
          <LogoText logo={<CurrencyLogo currency={currency} />} text={is1155 ? currency.name : currency.symbol} />
        ) : (
          <>Select Token</>
        )}
      </SelectButton>
      <Box flexGrow={1}>
        <InputNumerical
          placeholder={placeholder ?? 'Enter amount to swap'}
          value={value.toString()}
          onChange={onChange}
          type={'number'}
          disabled={disabled || disableInput}
          focused={inputFocused}
          integer={!!is1155}
          height={isDownMd ? 48 : 52}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={9}>
          <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}></Typography>
          <Box display="flex" alignItems={'center'}>
            {!hideBalance && (
              <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}>
                Balance:{' '}
                {!!currency && selectedCurrencyBalance ? trimBalance(selectedCurrencyBalance?.toSignificant(6)) : ''}
                {!selectedCurrencyBalance && '-'}
              </Typography>
            )}
            {currency && onMax && (
              <Button
                variant="text"
                sx={{ fontSize: 12, minWidth: 'unset', width: 'max-content', height: 'max-content', padding: '0 10px' }}
                onClick={onMax}
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
