import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import AppBody from 'components/AppBody'
import SelectButton from 'components/Button/SelectButton'
import NumericalInput from 'components/Input/InputNumerical'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import SampleNftLogo from 'assets/images/sample-nft.png'
import SampleTokenLogo from 'assets/images/ethereum-logo.png'
import Settings from 'components/essential/Settings'
import { AssetAccordion } from './AssetAccordion'
import { SwapSummary } from './SwapSummary'
import useModal from 'hooks/useModal'
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { Currency } from 'constants/token'
import LogoText from 'components/LogoText'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function Swap() {
  const theme = useTheme()
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')
  const [fromAccordionExpanded, setFromAccordionExpanded] = useState(false)
  const [toAccordionExpanded, setToAccordionExpanded] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const { showModal } = useModal()
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null)

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  const onToVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
  }, [])

  const onSelectCurrency = useCallback((currency: Currency) => {
    setFromCurrency(currency)
  }, [])

  const showCurrencySearch = useCallback(() => {
    showModal(<SelectCurrencyModal onSelectCurrency={onSelectCurrency} />)
  }, [onSelectCurrency, showModal])

  return (
    <>
      <AppBody width={'680px'} maxWidth={'680px'}>
        <Box
          sx={{
            padding: '33px 32px 30px',
            position: 'relative'
          }}
        >
          <Typography fontSize={28} mb={45}>
            SWAP
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              right: 32,
              top: 24,
              background: theme.palette.background.default,
              borderRadius: '8px',
              width: 52,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings />
          </Box>
          <Box display="flex" gap={16} mb={12}>
            <SelectButton width={'346px'} onClick={showCurrencySearch}>
              {fromCurrency ? (
                <LogoText logo={<CurrencyLogo currency={fromCurrency} />} text={fromCurrency.symbol} />
              ) : (
                <>Select Token</>
              )}
            </SelectButton>
            <NumericalInput
              value={fromVal}
              onChange={onFromVal}
              maxWidth={254}
              subStr="~$568.23"
              subStr2="Balence: 2.35512345 DAI"
            />
          </Box>
          <AssetAccordion
            logo={SampleTokenLogo}
            name="DAI"
            contract="123"
            tokenId="123"
            tokenType="ERC20"
            onChange={() => setFromAccordionExpanded(!fromAccordionExpanded)}
            expanded={fromAccordionExpanded}
          />
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box display="flex" gap={16} mb={12}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput
              value={toVal}
              onChange={onToVal}
              maxWidth={254}
              subStr="~$568.23"
              subStr2="Balence: 2.35512345 DAI"
            />
          </Box>
          <AssetAccordion
            logo={SampleNftLogo}
            name="DAI"
            contract="123"
            tokenId="123"
            tokenType="ERC20"
            onChange={() => setToAccordionExpanded(!toAccordionExpanded)}
            expanded={toAccordionExpanded}
          />
          <SwapSummary
            expanded={summaryExpanded}
            onChange={() => setSummaryExpanded(!summaryExpanded)}
            margin="20px 0 40px"
          />
          <Box display="grid" gap={16}>
            <ActionButton onAction={() => {}} actionText="Allow the Ladder to use your DAI" />
            <ActionButton onAction={() => {}} actionText="Swap" error="Select a Token" />
          </Box>
        </Box>
      </AppBody>
    </>
  )
}