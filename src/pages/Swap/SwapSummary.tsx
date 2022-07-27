import { useMemo } from 'react'
import { Typography, Box, useTheme, styled } from '@mui/material'
import { ReactComponent as InfoIcon } from 'assets/svg/info.svg'
import { ReactComponent as GasStationIcon } from 'assets/svg/gas_station.svg'
import Accordion from 'components/Accordion'
import QuestionHelper from 'components/essential/QuestionHelper'
import Divider from 'components/Divider'
import AddIcon from '@mui/icons-material/Add'
import Image from 'components/Image'
import { useIsDarkMode } from 'state/user/hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { HelperText } from 'constants/helperText'
import { AllTokens } from 'models/allTokens'
import useBreakpoint from 'hooks/useBreakpoint'

export function SwapSummary({
  fromAsset,
  toAsset,
  expanded,
  onChange,
  margin,
  gasFee,
  expectedNftQty,
  priceImpact,
  minReceiveNftQty,
  slippage,
  fromVal,
  toVal
}: {
  fromAsset?: AllTokens
  toAsset?: AllTokens
  expanded: boolean
  onChange: () => void
  gasFee?: string
  margin: string
  expectedNftQty: string
  priceImpact: string
  minReceiveNftQty: string
  slippage: string
  fromVal?: string
  toVal?: string
}) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const summary = useMemo(() => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" gap={14} alignItems="center">
          <InfoIcon />
          <Typography color={theme.palette.text.secondary}>
            {fromVal} {fromAsset?.name} = {toVal} {toAsset?.name}
            {/* (${currencyRate}) */}
          </Typography>
        </Box>

        <Box display="flex" gap={5} alignItems="center">
          <GasStationIcon />
          <Typography color={theme.palette.text.secondary}>~${gasFee || '-'}</Typography>
        </Box>
      </Box>
    )
  }, [theme.palette.text.secondary, fromVal, fromAsset?.name, toVal, toAsset?.name, gasFee])

  const details = useMemo(() => {
    return (
      <>
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Expected Output</Typography>
              {!isDownMd && <QuestionHelper text={HelperText.expectedOuptut} />}
            </Box>

            <Typography>
              {expectedNftQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Price Impact</Typography>
              {!isDownMd && <QuestionHelper text={HelperText.priceImpact} />}
            </Box>

            <Typography sx={{ color: theme.palette.text.secondary }}>{priceImpact}%</Typography>
          </Box>
        </Box>
        <Divider />
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9} sx={{ maxWidth: { xs: 154, md: 'unset' } }}>
              <Typography>Minimum received after slippage ({slippage}%)</Typography>
              {!isDownMd && <QuestionHelper text={HelperText.minReceived} />}
            </Box>

            <Typography>
              {minReceiveNftQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Network Fee</Typography>
              {!isDownMd && <QuestionHelper text={HelperText.networkFee} />}
            </Box>

            <Typography sx={{ color: theme.palette.text.secondary }}>~${gasFee || '-'}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box padding="12px 0">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography>Router</Typography>
            <AddIcon />
          </Box>
          <RouterGraph
            logo1={<CurrencyLogo currency={fromAsset} style={{ width: 24 }} />}
            logo2={<CurrencyLogo currency={toAsset} style={{ width: 24 }} />}
            fee="0.05%"
          />
          <Typography sx={{ color: theme.palette.text.secondary, opacity: 0.5 }}>
            Best price route costs ~${gasFee} in gas.This route optimizes your total output by considering aplit
            routes,multiple hops,and the gas cost of each step.
          </Typography>
        </Box>
      </>
    )
  }, [
    expectedNftQty,
    theme.palette.text.secondary,
    priceImpact,
    slippage,
    minReceiveNftQty,
    gasFee,
    fromAsset,
    toAsset,
    isDownMd
  ])

  return <Accordion summary={summary} details={details} expanded={expanded} onChange={onChange} margin={margin} />
}

function RouterGraph({ logo1, logo2, fee }: { logo1: string | JSX.Element; logo2: string | JSX.Element; fee: string }) {
  const theme = useTheme()
  const darkMode = useIsDarkMode()

  const Dashline = styled(Box)({
    borderBottom: `1px dashed ${theme.palette.text.secondary}`,
    position: 'absolute',
    width: '496px',
    left: 'calc(50% - 248px)'
  })

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px 0" position="relative">
      {/* <Image src={logo1} alt={'swap-from-logo'} style={{ width: 24 }} /> */}
      {typeof logo1 === 'string' ? (
        <Image src={logo1 as string} alt={`from-asset-logo`} style={{ width: 24 }} />
      ) : (
        logo1
      )}
      <Box
        sx={{
          background: darkMode ? '#484D50' : '#ffffff',
          width: 125,
          height: 38,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          zIndex: 1
        }}
      >
        <DualLogo logo1={logo1} logo2={logo2} />
        <Typography>{fee}</Typography>
      </Box>
      {typeof logo2 === 'string' ? <Image src={logo2 as string} alt={`to-asset-logo`} style={{ width: 24 }} /> : logo2}
      <Dashline />
    </Box>
  )
}

function DualLogo({ logo1, logo2 }: { logo1: string | JSX.Element; logo2: string | JSX.Element }) {
  return (
    <Box sx={{ display: 'flex' }}>
      {typeof logo1 === 'string' ? (
        <Image src={logo1 as string} alt={`to-asset-logo`} style={{ width: 24, transform: 'translate(-7px)' }} />
      ) : (
        logo1
      )}
      {typeof logo2 === 'string' ? (
        <Image src={logo2 as string} alt={`to-asset-logo`} style={{ width: 24, transform: 'translate(-7px)' }} />
      ) : (
        <Box
          sx={{
            width: 24,
            height: 24,
            transform: 'translate(-7px)',
            background: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {logo2}
        </Box>
      )}
    </Box>
  )
}
