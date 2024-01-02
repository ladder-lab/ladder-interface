import { Box, Button, styled, Typography } from '@mui/material'
import DefaultAvatar from 'assets/svg/default_avatar.svg'
import ARPIcon from 'assets/svg/MathOperations.svg'
import { CenterRow } from './Farms'

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

export function TestNetCardList({ list }: { list: TestNetData[] }) {
  return (
    <Grid>
      {list.map((data, idx) => (
        <TestNetCard key={idx} data={data} />
      ))}
    </Grid>
  )
}

export function TestNetCard({ data }: { data: TestNetData }) {
  return (
    <CardBg>
      <CenterRow>
        <img src={data.avatar || DefaultAvatar} />
        <BlackText sx={{ fontSize: '18px' }}>{data.name}</BlackText>
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
        <Button style={{ fontSize: '14px', height: '44px', marginTop: '8px' }}>Stake LP</Button>
      </RowBg>
    </CardBg>
  )
}
