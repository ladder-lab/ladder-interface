import { Typography } from '@mui/material'
import { Container, Title } from './Farms'
import { FakeData, TestNetCardList } from './TestNetCard'

export default function NFTStaking() {
  return (
    <Container>
      <Title>NFT Staking</Title>
      <Typography>Stake Token To Get LAD Rewards</Typography>
      <TestNetCardList list={FakeData} />
    </Container>
  )
}
