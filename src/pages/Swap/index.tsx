import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box, useTheme, Button } from '@mui/material'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import Settings from 'components/essential/Settings'
import { AssetAccordion } from './AssetAccordion'
import { SwapSummary } from './SwapSummary'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { AllTokens } from 'models/allTokens'

export default function Swap() {
  const theme = useTheme()
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')

  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [fromCurrency, setFromCurrency] = useState<AllTokens | null>(null)
  const [toCurrency, setToCurrency] = useState<AllTokens | null>(null)

  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  const onToVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
  }, [])

  const onSelectFromCurrency = useCallback((currency: AllTokens) => {
    setFromCurrency(currency)
  }, [])
  const onSelectToCurrency = useCallback((currency: AllTokens) => {
    setToCurrency(currency)
  }, [])

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
          <Box mb={12}>
            <CurrencyInputPanel
              value={fromVal}
              onChange={onFromVal}
              onSelectCurrency={onSelectFromCurrency}
              currency={fromCurrency}
            />
          </Box>
          {fromCurrency && <AssetAccordion token={fromCurrency} />}
          <Box sx={{ height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowCircle />
          </Box>

          <Box mb={12}>
            <CurrencyInputPanel
              fromTokenType={fromCurrency ? ('tokenId' in fromCurrency ? 'erc1155' : 'erc20') : undefined}
              value={toVal}
              onChange={onToVal}
              onSelectCurrency={onSelectToCurrency}
              currency={toCurrency}
            />
          </Box>
          {toCurrency && <AssetAccordion token={toCurrency} />}
          <SwapSummary
            expanded={summaryExpanded}
            onChange={() => setSummaryExpanded(!summaryExpanded)}
            margin="20px 0 40px"
          />
          {account ? (
            <Box display="grid" gap={16}>
              <ActionButton onAction={() => {}} actionText="Allow the Ladder to use your DAI" />
              <ActionButton onAction={() => {}} actionText="Swap" error="Select a Token" />
            </Box>
          ) : (
            <Button sx={{ background: theme.gradient.gradient1 }} onClick={toggleWallet}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </AppBody>
    </>
  )
}
