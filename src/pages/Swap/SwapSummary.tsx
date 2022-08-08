import { useMemo } from 'react'
import { Typography, Box, useTheme, styled } from '@mui/material'
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
import { getTokenText } from 'utils/checkIs1155'

export function SwapSummary({
  fromAsset,
  toAsset,
  expanded,
  onChange,
  margin,
  gasFee,
  price,
  minReceiveQty,
  slippage,
  toVal
}: {
  fromAsset?: AllTokens
  toAsset?: AllTokens
  expanded: boolean
  onChange: () => void
  gasFee?: string
  margin: string
  minReceiveQty: string
  slippage: number
  toVal?: string
  price?: string
}) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const { Token1Text, Token2Text } = getTokenText(fromAsset, toAsset)

  const summary = useMemo(() => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 10, md: 13 } }}>
          <InfoIcon color={theme.palette.text.primary} />
          <Typography color={theme.palette.text.secondary}>
            1 <Token1Text /> = {price} <Token2Text />
            {/* (${currencyRate}) */}
          </Typography>
        </Box>

        <Box display="flex" gap={5} alignItems="center">
          <GasStationIcon />
          <Typography color={theme.palette.text.secondary}>~${gasFee || '-'}</Typography>
        </Box>
      </Box>
    )
  }, [theme.palette.text.primary, theme.palette.text.secondary, Token1Text, price, Token2Text, gasFee])

  const details = useMemo(() => {
    return (
      <>
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Expected Output</Typography>
              {!isDownMd && (
                <QuestionHelper
                  text={HelperText.expectedOuptut}
                  style={{ color: theme.palette.text.secondary, background: 'transparent' }}
                />
              )}
            </Box>

            <Typography>
              {toVal} <span style={{ color: theme.palette.text.secondary }}>{toAsset?.symbol}s</span>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Price Impact</Typography>
              {!isDownMd && (
                <QuestionHelper
                  text={HelperText.priceImpact}
                  style={{ color: theme.palette.text.secondary, background: 'transparent' }}
                />
              )}
            </Box>

            <Typography sx={{ color: theme.palette.text.secondary }}>{slippage}%</Typography>
          </Box>
        </Box>
        <Divider />
        <Box display="grid" gap={8} padding="12px 0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9} sx={{ maxWidth: { xs: 154, md: 'unset' } }}>
              <Typography>Minimum received after slippage ({slippage}%)</Typography>
              {!isDownMd && (
                <QuestionHelper
                  text={HelperText.minReceived}
                  style={{ color: theme.palette.text.secondary, background: 'transparent' }}
                />
              )}
            </Box>

            <Typography>
              {minReceiveQty} <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={9}>
              <Typography>Network Fee</Typography>
              {!isDownMd && (
                <QuestionHelper
                  text={HelperText.networkFee}
                  style={{ color: theme.palette.text.secondary, background: 'transparent' }}
                />
              )}
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
  }, [isDownMd, toVal, theme.palette.text.secondary, toAsset, slippage, minReceiveQty, gasFee, fromAsset])

  return <Accordion summary={summary} details={details} expanded={expanded} onChange={onChange} margin={margin} />
}

function RouterGraph({ logo1, logo2, fee }: { logo1: string | JSX.Element; logo2: string | JSX.Element; fee: string }) {
  const theme = useTheme()
  const darkMode = useIsDarkMode()

  const Dashline = styled(Box)({
    borderBottom: `1px dashed ${theme.palette.text.secondary}`,
    position: 'absolute',
    width: 'calc(100% - 64px)'
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
      <Box sx={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Dashline />
      </Box>
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

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M8.16406 4.52311H9.83073V6.18978H8.16406V4.52311ZM8.16406 7.85645H9.83073V12.8564H8.16406V7.85645ZM8.9974 0.356445C4.3974 0.356445 0.664062 4.08978 0.664062 8.68978C0.664062 13.2898 4.3974 17.0231 8.9974 17.0231C13.5974 17.0231 17.3307 13.2898 17.3307 8.68978C17.3307 4.08978 13.5974 0.356445 8.9974 0.356445ZM8.9974 15.3564C5.3224 15.3564 2.33073 12.3648 2.33073 8.68978C2.33073 5.01478 5.3224 2.02311 8.9974 2.02311C12.6724 2.02311 15.6641 5.01478 15.6641 8.68978C15.6641 12.3648 12.6724 15.3564 8.9974 15.3564Z"
        fill={color}
      />
    </svg>
  )
}
