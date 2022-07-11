import { Typography, Box, useTheme, styled } from '@mui/material'
import { ReactComponent as InfoIcon } from 'assets/svg/info.svg'
import { ReactComponent as GasStationIcon } from 'assets/svg/gas_station.svg'
import Accordion from 'components/Accordion'
import QuestionHelper from 'components/essential/QuestionHelper'
import Divider from 'components/Divider'
import AddIcon from '@mui/icons-material/Add'
import Image from 'components/Image'
import SampleNftLogo from 'assets/images/sample-nft.png'
import SampleTokenLogo from 'assets/images/ethereum-logo.png'

export function SwapSummary({
  expanded,
  onChange,
  margin
}: {
  expanded: boolean
  onChange: () => void
  margin: string
}) {
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
