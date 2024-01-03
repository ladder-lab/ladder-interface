import { Grid, TestNetCard, TestNetData } from './Card'
import { CardTYPE, Container, Title, CenterBetweenRow, CenterRow } from '.'
import { useState } from 'react'
import { Box, Button, Modal, styled, Typography, useTheme } from '@mui/material'
import Close from 'assets/svg/close.svg'
import LinkIcon from 'assets/svg/open_new_link.svg'
import NumericalInputMax from '../../components/Input/InputNumericalMax'

export default function Farms() {
  const [open, isOpen] = useState(false)
  const [modalData, setModalData] = useState<TestNetData>()
  const [isRio] = useState<boolean>(false)
  return (
    <>
      <>
        <Modal open={open && modalData != null} onClose={() => isOpen(false)}>
          {isRio ? <StackModal isOpen={isOpen} /> : <RoiModal isOpen={isOpen} />}
        </Modal>
      </>
      <Container>
        <Title>Farms</Title>
        <Typography>Stake ERC20 and NFT Liquidity Pool (LP) tokens to earn LAD.</Typography>

        <Grid>
          {FakeData.map((data, idx) => (
            <TestNetCard
              type={CardTYPE.box}
              onClick={data => {
                setModalData(data)
              }}
              key={idx}
              setModalStatus={() => isOpen(true)}
              data={data}
            />
          ))}
        </Grid>
      </Container>
    </>
  )
}

const RoiGrid = styled(Box)`
  margin-top: 15px;
  display: grid;
  grid-template-columns: 150px 122px 171px;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
`

const RoiGridTitle = styled(Typography)`
  background: #f6f6f6;
  color: #828282;
  padding: 9px 20px;
`

const FakeRoiData = [
  {
    timeframe: '1d',
    roi: '0.16%',
    ladPerK: '0.04'
  },
  {
    timeframe: '7d',
    roi: '1.20%',
    ladPerK: '0.3'
  },
  {
    timeframe: '30d',
    roi: '5.30%',
    ladPerK: '1.32'
  },
  {
    timeframe: '365d (APY)',
    roi: '87.64%',
    ladPerK: '21.82'
  }
]
const RoiText = styled(Typography)`
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  margin-left: 20px;
`

function RoiModal({ isOpen }: { isOpen: (arg: boolean) => void }) {
  return (
    <ModalBg>
      <CenterBetweenRow justifyContent="space-between">
        <Typography lineHeight={'28px'} fontSize={'24px'} fontWeight={600}>
          ROI
        </Typography>
        <Box
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <img src={Close} onClick={() => isOpen(false)} />
        </Box>
      </CenterBetweenRow>
      <RoiGrid>
        <RoiGridTitle>TIMEFRAME</RoiGridTitle>
        <RoiGridTitle>ROI</RoiGridTitle>
        <RoiGridTitle>LAD PER: $1000</RoiGridTitle>
        {FakeRoiData.map(frd => {
          return (
            <>
              <RoiText>{frd.timeframe}</RoiText>
              <RoiText>{frd.roi}</RoiText>
              <RoiText>{frd.ladPerK}</RoiText>
            </>
          )
        })}
      </RoiGrid>
      <Typography
        sx={{
          color: '#828282',
          fontSize: '14px',
          lineHeight: '20px',
          marginTop: '22px'
        }}
      >
        Calculated based on current rates. Compounding 1x daily. Rates are
        <br /> estimates provided for your convenience only, and by no means represent
        <br /> guaranteed returns.
      </Typography>
      <CenterRow justifyContent={'center'} mt={28}>
        <a style={{ color: '#1F9898' }}>Get LAD-ASD LP</a>
        <img src={LinkIcon} />
      </CenterRow>
    </ModalBg>
  )
}

const ModalBg = styled(Box)`
  background: white;
  border-radius: 12px;
  padding: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 521px;
`

function StackModal({ isOpen }: { isOpen: (arg: boolean) => void }) {
  const theme = useTheme()
  const [value, setValue] = useState<string>('')

  return (
    <ModalBg>
      <CenterBetweenRow justifyContent="space-between">
        <Typography lineHeight={'28px'} fontSize={'24px'} fontWeight={600}>
          Stake LP tokens
        </Typography>
        <Box
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <img src={Close} onClick={() => isOpen(false)} />
        </Box>
      </CenterBetweenRow>
      <CenterBetweenRow mt={40}>
        <Typography lineHeight={'19px'} fontSize={'16px'} fontWeight={600}>
          Stake
        </Typography>
        <Typography lineHeight={'19px'} fontSize={'16px'} fontWeight={600}>
          Balance: 0.004
        </Typography>
      </CenterBetweenRow>
      <CenterBetweenRow
        sx={{
          background: '#F6F6F6',
          borderRadius: '8px',
          height: '52px',
          marginTop: '12px'
        }}
      >
        <NumericalInputMax value={value} onChange={e => setValue(e.target.value)} onMax={() => {}} />
      </CenterBetweenRow>
      <CenterBetweenRow gap={12} mt={16}>
        <Button
          sx={{
            height: '44px',
            background: theme.palette.background.default,
            color: '#333333'
          }}
          onClick={() => isOpen(false)}
        >
          Cancel
        </Button>
        <Button sx={{ height: '44px' }}>Confirm</Button>
      </CenterBetweenRow>
      <CenterRow justifyContent={'center'} mt={28}>
        <a style={{ color: '#1F9898' }}>Get LAD-ASD LP</a>
        <img src={LinkIcon} />
      </CenterRow>
    </ModalBg>
  )
}

export const FakeData = [
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  },
  {
    avatar: '',
    name: 'LAD-KNS',
    state: 'live',
    apr: '60.99%',
    earn: 'LAD',
    ladEarn: '0'
  }
]
