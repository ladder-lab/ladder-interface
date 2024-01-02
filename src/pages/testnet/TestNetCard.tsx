import { Box, Button, Modal, styled, Typography, useTheme } from '@mui/material'
import DefaultAvatar from 'assets/svg/default_avatar.svg'
import ARPIcon from 'assets/svg/MathOperations.svg'
import { CenterBetweenRow, CenterRow } from './TestNetFarm'
import { useState } from 'react'
import Close from 'assets/svg/close.svg'
import LinkIcon from 'assets/svg/open_new_link.svg'
import NumericalInputMax from '../../components/Input/InputNumericalMax'

interface TestNetData {
  avatar: string
  name: string
  state: string
  apr: string
  earn: string
  ladEarn: string
}

const CardBg = styled(Box)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border-radius: 12px;
`
const RowBg = styled(Box)`
  background: #f6f6f6;
  padding: 16px 12px;
  border-radius: 8px;
`
const BlackText = styled(Typography)`
  color: #333333;
`

const BetweenRow = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const BetweenRowBg = styled(RowBg)`
  display: flex;
  justify-content: space-between;
`
const Row = styled(Box)`
  display: flex;
  gap: 4px;
  align-items: baseline;
`
const Hint = styled(Typography)`
  color: #828282;
  font-weight: 500;
  font-size: 16px;
`

const Grid = styled(Box)`
  display: grid;
  gap: 20px;
  margin-top: 30px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`

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

export function TestNetCardList({ list }: { list: TestNetData[] }) {
  const [open, isOpen] = useState(false)
  const [modalData, setModalData] = useState<TestNetData>()
  const showStack = false
  return (
    <>
      <Modal open={open && modalData != null} onClose={() => isOpen(false)}>
        {showStack ? <StackModal isOpen={isOpen} /> : <RoiModal isOpen={isOpen} />}
      </Modal>
      <Grid>
        {list.map((data, idx) => (
          <TestNetCard
            onClick={data => {
              setModalData(data)
              isOpen(true)
            }}
            key={idx}
            data={data}
          />
        ))}
      </Grid>
    </>
  )
}

export function TestNetCard({ data, onClick }: { data: TestNetData; onClick: (arg: TestNetData) => void }) {
  return (
    <CardBg>
      <CenterRow>
        <img src={data.avatar || DefaultAvatar} />
        <BlackText sx={{ fontSize: '18px' }}>{data.name}</BlackText>
        <Box
          sx={{
            background: 'linear-gradient(96.44deg, #D8FF20 5.94%, #99F7F4 97.57%)',
            color: '#333333',
            padding: '0 5px',
            top: '-14px',
            right: '4px',
            borderRadius: '4px',
            fontSize: 12,
            ml: 5
          }}
        >
          live
        </Box>
      </CenterRow>
      <BetweenRowBg>
        <Hint>APR</Hint>
        <Box display={'flex'} alignItems={'center'} gap={'5px'}>
          <BlackText>{data.apr}</BlackText>
          <img src={ARPIcon} />
        </Box>
      </BetweenRowBg>
      <BetweenRowBg>
        <Hint>Earn</Hint>
        <BlackText>{data.earn}</BlackText>
      </BetweenRowBg>
      <RowBg>
        <Row>
          <BlackText>LAD</BlackText>
          <Hint>earned:</Hint>
        </Row>
        <BetweenRow>
          <BlackText>{data.ladEarn}</BlackText>
          <Button
            style={{
              fontSize: '14px',
              height: 'auto',
              width: 'fit-content'
            }}
          >
            Harvest
          </Button>
        </BetweenRow>
      </RowBg>
      <RowBg>
        <Row>
          <Typography>LAD</Typography>
          <Hint>staked</Hint>
        </Row>
        <Button style={{ fontSize: '14px', height: '44px', marginTop: '8px' }} onClick={() => onClick(data)}>
          Stake LP
        </Button>
      </RowBg>
    </CardBg>
  )
}
