import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box, IconButton, SxProps, styled, useTheme } from '@mui/material'
import AppBody from 'components/AppBody'
import SelectButton from 'components/Button/SelectButton'
import NumericalInput from 'components/Input/InputNumerical'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as SettingIcon } from 'assets/svg/setting.svg'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'
import Accordion from 'components/Accordion'
import { ReactComponent as InfoIcon } from 'assets/svg/info.svg'
import { ReactComponent as GasStationIcon } from 'assets/svg/gas_station.svg'
import QuestionHelper from 'components/essential/QuestionHelper'
import Divider from 'components/Divider'
import AddIcon from '@mui/icons-material/Add'
import Image from 'components/Image'
import SampleNftLogo from 'assets/images/sample-nft.png'
import SampleTokenLogo from 'assets/images/ethereum-logo.png'

export default function Swap() {
  const [fromVal, setFromVal] = useState('')
  const [toVal, setToVal] = useState('')
  const [fromAccordionExpanded, setFromAccordionExpanded] = useState(false)
  const [toAccordionExpanded, setToAccordionExpanded] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(false)

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  const onToVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
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
          <SettingButton sx={{ position: 'absolute', right: 32, top: 24 }} />
          <Box display="flex" gap={16} mb={12}>
            <SelectButton width={'346px'}>DAI</SelectButton>
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
          <ActionButton onAction={() => {}} actionText="Swap" error="Select a Token" />
        </Box>
      </AppBody>
    </>
  )
}

function SettingButton({ sx }: { sx: SxProps }) {
  return (
    <IconButton sx={{ backgroundColor: '#F7F7F7', borderRadius: '8px', width: 52, height: 52, ...sx }}>
      <SettingIcon />
    </IconButton>
  )
}

function AssetAccordion({
  logo,
  name,
  contract,
  tokenId,
  tokenType,
  expanded,
  onChange
}: {
  logo: string
  name: string
  contract: string
  tokenId?: string
  tokenType?: string
  expanded: boolean
  onChange: () => void
}) {
  const theme = useTheme()

  const Tag = styled(Box)({
    borderRadius: '10px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.15 )',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 12,
    padding: '4px 12px'
  })

  const summary = (
    <Box sx={{ display: 'flex', gap: 19, alignItems: 'center' }}>
      <Image src={logo} style={{ width: 36 }} />
      <Box display="grid" gap={8}>
        <Typography color={theme.palette.text.secondary}>Name: {name}</Typography>
        <Typography color={theme.palette.text.secondary}>Contract: {contract}</Typography>
        <Typography color={theme.palette.text.secondary}>Token Id: {tokenId || 'none'}</Typography>
      </Box>

      <Tag>{tokenType}</Tag>
    </Box>
  )

  const details = (
    <Box pt={12}>
      <Typography color={theme.palette.text.secondary}>Supply/Holder: 20000/500</Typography>
      {/* Graph */}
      {/* View accrued fees and analytics or NFTscan */}
    </Box>
  )

  return (
    <Accordion
      summary={summary}
      details={details}
      expanded={expanded}
      onChange={onChange}
      iconCssOverride={{ right: 0, bottom: 0, position: 'absolute' }}
    />
  )
}

function SwapSummary({ expanded, onChange, margin }: { expanded: boolean; onChange: () => void; margin: string }) {
  const theme = useTheme()

  const summary = (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      <Box display="flex" gap={14} alignItems="center">
        <InfoIcon />
        <Typography color={theme.palette.text.secondary}>1 Tickets for the...= 0.254587 DAI ($1.0000)</Typography>
      </Box>

      <Box display="flex" gap={5} alignItems="center">
        <GasStationIcon />
        <Typography color={theme.palette.text.secondary}>-$8.23</Typography>
      </Box>
    </Box>
  )

  const details = (
    <>
      <Box display="grid" gap={8} padding="12px 0">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={9}>
            <Typography>Expected Output</Typography>
            <QuestionHelper text="..." />
          </Box>

          <Typography>
            50 <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={9}>
            <Typography>Price Impact</Typography>
            <QuestionHelper text="..." />
          </Box>

          <Typography sx={{ color: theme.palette.text.secondary }}>0.41%</Typography>
        </Box>
      </Box>
      <Divider />
      <Box display="grid" gap={8} padding="12px 0">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={9}>
            <Typography>EMinimum received after slippage (13.36%)</Typography>
            <QuestionHelper text="..." />
          </Box>

          <Typography>
            48 <span style={{ color: theme.palette.text.secondary }}>NFTs</span>
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={9}>
            <Typography>Network Fee</Typography>
            <QuestionHelper text="..." />
          </Box>

          <Typography sx={{ color: theme.palette.text.secondary }}>~$8.23</Typography>
        </Box>
      </Box>
      <Divider />
      <Box padding="12px 0">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography>Router</Typography>
          <AddIcon />
        </Box>
        <RouterGraph logo1={SampleTokenLogo} logo2={SampleNftLogo} fee="0.05%" />
        <Typography sx={{ color: theme.palette.text.secondary, opacity: 0.5 }}>
          Best price route costs ~$8.23 in gas.This route optimizes your total output by considering aplit
          routes,multiple hops,and the gas cost of each step.
        </Typography>
      </Box>
    </>
  )

  return <Accordion summary={summary} details={details} expanded={expanded} onChange={onChange} margin={margin} />
}

function RouterGraph({ logo1, logo2, fee }: { logo1: string; logo2: string; fee: string }) {
  const theme = useTheme()

  const Dashline = styled(Box)({
    borderBottom: `1px dashed ${theme.palette.text.secondary}`,
    position: 'absolute',
    width: '496px',
    left: 'calc(50% - 248px)'
  })

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px 0" position="relative">
      <Image src={logo1} alt={'swap-from-logo'} style={{ width: 24 }} />
      <Box
        sx={{
          background: theme.palette.background.paper,
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
      <Image src={logo2} alt={'swap-to-logo'} style={{ width: 24 }} />
      <Dashline />
    </Box>
  )
}

function DualLogo({ logo1, logo2 }: { logo1: string; logo2: string }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Image src={logo1} style={{ width: 24 }} />
      <Image src={logo2} style={{ width: 24, transform: 'translate(-7px)' }} />
    </Box>
  )
}
