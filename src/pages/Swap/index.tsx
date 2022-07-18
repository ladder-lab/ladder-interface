import { useCallback, useState, ChangeEvent, useMemo } from 'react'
import { Typography, Box, useTheme, Button } from '@mui/material'
import AppBody from 'components/AppBody'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import Settings from 'components/essential/Settings'
import { AssetAccordion } from './AssetAccordion'
import { SwapSummary } from './SwapSummary'
import { Currency } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import ConfirmSwapModal from 'components/Modal/ConfirmSwapModal'
import useModal from 'hooks/useModal'

export default function Swap() {
  const theme = useTheme()
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')
  const [fromAccordionExpanded, setFromAccordionExpanded] = useState(false)
  const [toAccordionExpanded, setToAccordionExpanded] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [fromAsset, setFromAsset] = useState<Currency | undefined>(undefined)
  const [toAsset, setToAsset] = useState<Currency | undefined>(undefined)

  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()

  const { showModal } = useModal()

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  const onToVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
  }, [])

  const onSelectFromAsset = useCallback((asset: Currency) => {
    setFromAsset(asset)
  }, [])

  const onSelectToAsset = useCallback((asset: Currency) => {
    setToAsset(asset)
  }, [])

  const error = useMemo(() => {
    if (!fromAsset || !toAsset) {
      return 'Select a Token'
    }

    return undefined
  }, [fromAsset, toAsset])

  const onSwap = useCallback(() => {
    showModal(<ConfirmSwapModal onConfirm={() => {}} from={fromAsset} to={toAsset} fromVal={fromVal} toVal={toVal} />)
  }, [fromAsset, toAsset, fromVal, toVal])

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
              onSelectCurrency={onSelectFromAsset}
              currency={fromAsset}
            />
          </Box>
          <AssetAccordion
            logo={<CurrencyLogo currency={fromAsset} />}
            name={fromAsset?.symbol || ''}
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
            <CurrencyInputPanel
              value={toVal}
              onChange={onToVal}
              onSelectCurrency={onSelectToAsset}
              currency={toAsset}
            />
          </Box>
          <AssetAccordion
            logo={<CurrencyLogo currency={toAsset} />}
            name={toAsset?.symbol || ''}
            contract="123"
            tokenId="123"
            tokenType="ERC20"
            onChange={() => setToAccordionExpanded(!toAccordionExpanded)}
            expanded={toAccordionExpanded}
          />
          <SwapSummary
            fromAsset={fromAsset}
            toAsset={toAsset}
            expanded={summaryExpanded}
            onChange={() => setSummaryExpanded(!summaryExpanded)}
            margin="20px 0 40px"
            gasFee="8.23"
            currencyPrice={'123'}
            currencyRate={'1.000'}
            expectedNftQty={'50'}
            priceImpact={'0.41'}
            minReceiveNftQty={'48'}
            slippage="13.68"
          />
          {account ? (
            <Box display="grid" gap={16}>
              <ActionButton onAction={() => {}} actionText="Allow the Ladder to use your DAI" />
              <ActionButton onAction={onSwap} actionText="Swap" error={error} />
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
