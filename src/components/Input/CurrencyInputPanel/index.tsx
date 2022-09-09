import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Box, useTheme, Typography, Button, ButtonBase } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import SelectButton from 'components/Button/SelectButton'
import useModal from 'hooks/useModal'
import LogoText from 'components/LogoText'
import SelectCurrencyModal from './SelectCurrencyModal'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { AllTokens, TokenType } from 'models/allTokens'
import { checkIs1155, filter721 } from 'utils/checkIs1155'
import useBreakpoint from 'hooks/useBreakpoint'
import { getSymbol } from 'utils/getSymbol'
import Erc721IdSelectionModal from 'components/Modal/Erc721IdSelectionModal'
import { Token721 } from 'constants/token/token721'
import QuestionHelper from 'components/essential/QuestionHelper'

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

enum SwapType {
  AUTO = 'auto',
  MANUAL = 'Choose by yourself'
}

function SwapTypeButton({
  onClick,
  text,
  helperText,
  selected
}: {
  onClick: () => void
  text: string
  helperText: string
  selected: boolean
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        height: 22,
        padding: '0 12px',
        borderRadius: '10px',
        background: theme => (selected ? theme.palette.background.default : 'none'),
        border: theme => `1px solid ${selected ? 'none' : theme.palette.primary.main}`
      }}
    >
      <Typography sx={{ color: theme => theme.palette.primary.main, mr: 4 }}>{text}</Typography>
      <QuestionHelper text={helperText} />
    </ButtonBase>
  )
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
  const [isOpen, setIsOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const is1155 = checkIs1155(currency)
  const is721 = filter721(currency)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const [swapType, setSwapType] = useState(SwapType.AUTO)

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

  useEffect(() => {
    onSelectSubTokens && onSelectSubTokens([])
  }, [currency, onSelectSubTokens])

  return (
    <>
      {is721 && (
        <>
          <Erc721IdSelectionModal
            amount={value ? +value : 0}
            onSelectSubTokens={onSelectSubTokens}
            collection={is721}
            isOpen={isOpen}
            onDismiss={() => {
              setIsOpen(false)
            }}
          />
          <Box
            sx={{
              paddingBottom: 12,
              margin: '0 auto',
              paddingLeft: 362,
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 12, mt: 16 }}>
              <SwapTypeButton
                selected={swapType === SwapType.AUTO}
                text={SwapType.AUTO}
                helperText="auto..."
                onClick={() => {
                  setSwapType(SwapType.AUTO)
                  onSelectSubTokens && onSelectSubTokens([])
                }}
              />
              <SwapTypeButton
                selected={swapType === SwapType.MANUAL}
                text={SwapType.MANUAL}
                helperText="choose by yourself..."
                onClick={() => {
                  setIsOpen(true)
                  setSwapType(SwapType.MANUAL)
                }}
              />
            </Box>
          </Box>
        </>
      )}
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
            <LogoText logo={<CurrencyLogo currency={currency} />} text={is1155 ? currency.name : getSymbol(currency)} />
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
                  sx={{
                    fontSize: 12,
                    minWidth: 'unset',
                    width: 'max-content',
                    height: 'max-content',
                    padding: '0 10px'
                  }}
                  onClick={onMax}
                >
                  MAX
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
