import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
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
import { useIntervalGetToken721 } from 'hooks/useInterval'

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
  enableAuto?: boolean
  pairAddress?: string | undefined
  currencyA?: AllTokens | null
  currencyB?: AllTokens | null
}

enum SwapType {
  AUTO = 'Auto',
  MANUAL = 'Choose by yourself'
}

function SwapTypeButton({
  onClick,
  text,
  helperText,
  selected,
  disabled
}: {
  onClick: () => void
  text: string
  helperText: string
  selected: boolean
  disabled?: boolean
}) {
  return (
    <ButtonBase
      disabled={disabled}
      onClick={onClick}
      sx={{
        height: 22,
        padding: '0 12px',
        borderRadius: '10px',
        background: theme => theme.palette.background.default,
        border: theme => `1px solid ${selected ? theme.palette.primary.main : 'none'}`
      }}
    >
      <Typography sx={{ color: theme => theme.palette.primary.main, mr: 4, fontSize: 12 }}>{text}</Typography>
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
  onSelectSubTokens,
  enableAuto,
  pairAddress,
  currencyA,
  currencyB
}: Props) {
  // const [isOpen, setIsOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const is1155 = checkIs1155(currency)
  const is721 = filter721(currency)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const [swapType, setSwapType] = useState(SwapType.AUTO)
  console.log('currency=>', currency)

  const { hideModal, showModal } = useModal()
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const IsDisplay = useMemo(() => {
    if ((!currencyA && !currencyB) || is1155 || is721) return false
    if (checkIs1155(currencyA) || checkIs1155(currencyB) || filter721(currencyA) || filter721(currencyB)) {
      return true
    }
    return false
  }, [currencyA, currencyB, is1155, is721])

  const showCurrencySearch = useCallback(() => {
    if (!disableCurrencySelect) {
      showModal(
        <SelectCurrencyModal
          onSelectCurrency={onSelectCurrency}
          selectedTokenType={selectedTokenType}
          IsDisplay={IsDisplay}
          // onSelectSubTokens={onSelectSubTokens}
        />
      )
    }
  }, [IsDisplay, disableCurrencySelect, showModal, onSelectCurrency, selectedTokenType])

  const subTokenSelection = useCallback(() => {
    if (onSelectSubTokens) {
      showModal(
        <Erc721IdSelectionModal
          // amount={value ? +value : 0}
          onSelectSubTokens={onSelectSubTokens}
          collection={is721}
          pairAddress={pairAddress}
          setAmount={onChange}
          // isOpen={true}
          onDismiss={hideModal}
          // onDismiss={() => {
          //   setIsOpen(false)
          // }}
        />
      )
    }
  }, [hideModal, is721, onChange, onSelectSubTokens, pairAddress, showModal])

  const handleOpenIdSelectionModal = useCallback(() => {
    subTokenSelection()
    setSwapType(SwapType.MANUAL)
  }, [subTokenSelection])

  useEffect(() => {
    if (enableAuto && swapType === SwapType.AUTO && onSelectSubTokens) {
      onSelectSubTokens([])
    }
  }, [enableAuto, onSelectSubTokens, swapType])

  const { token721 } = useIntervalGetToken721(is721)

  return (
    <>
      {is721 && onSelectSubTokens && (
        <>
          <Box
            sx={{
              paddingBottom: 12,
              margin: '0 auto',
              paddingLeft: {
                xs: 0,
                md: 305
              },
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                mt: 16,
                justifyContent: {
                  xs: 'flex-end',
                  md: 'flex-start'
                }
              }}
            >
              {enableAuto && (
                <SwapTypeButton
                  selected={swapType === SwapType.AUTO}
                  text={SwapType.AUTO}
                  helperText="You will receive non-selective/random NFT after each swap."
                  onClick={() => {
                    setSwapType(SwapType.AUTO)
                    onSelectSubTokens && onSelectSubTokens([])
                  }}
                />
              )}
              <SwapTypeButton
                disabled={enableAuto && !pairAddress}
                selected={swapType === SwapType.MANUAL}
                text={SwapType.MANUAL}
                helperText={
                  enableAuto && !pairAddress
                    ? 'Choose the input token first'
                    : 'You can choose specific NFTs from the pool.'
                }
                onClick={handleOpenIdSelectionModal}
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
          width={isDownMd ? '100%' : '286px'}
          onClick={showCurrencySearch}
          disabled={disableCurrencySelect || disabled}
          primary={selectActive}
          height={isDownMd ? '48px' : '52px'}
          selected={!!currency}
        >
          {currency ? (
            <LogoText
              logo={<CurrencyLogo currency={currency} />}
              text={is1155 ? currency.name : token721?.symbol || getSymbol(currency, chainId)}
            />
          ) : (
            <>Select Token</>
          )}
        </SelectButton>
        {is721 && !enableAuto ? (
          <Box flexGrow={1}>
            <SelectButton onClick={handleOpenIdSelectionModal} selected={!!value}>
              {!!value ? value.toString() : 'Choose token Id'}
            </SelectButton>
          </Box>
        ) : (
          <Box flexGrow={1}>
            <InputNumerical
              placeholder={placeholder ?? 'Enter amount'}
              value={value.toString()}
              onChange={onChange}
              type={'number'}
              disabled={disabled || disableInput}
              focused={inputFocused}
              integer={!!is1155 || !!is721}
              height={isDownMd ? 48 : 52}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={9}>
              <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}></Typography>
              <Box display="flex" alignItems={'center'}>
                {!hideBalance && (
                  <Typography fontSize={12} sx={{ color: theme.palette.text.secondary }}>
                    Balance:{' '}
                    {!!currency && selectedCurrencyBalance
                      ? trimBalance(selectedCurrencyBalance?.toSignificant(6))
                      : ''}
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
        )}
      </Box>
    </>
  )
}
