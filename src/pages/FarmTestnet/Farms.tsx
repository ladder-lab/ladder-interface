import { Box, styled, Typography } from '@mui/material'
import { useState } from 'react'
import { FakeData, TestNetCardList } from './TestNetCard'

export const Row = styled(Box)`
  display: flex;
`
export const CenterRow = styled(Row)`
  align-items: center;
`
const Tab = styled(Row)`
  background: white;
  width: 100%;
  padding: 18px 45px;
  gap: 24px;
`
const TabItem = styled(Typography)`
  font-size: 16px;
  padding: 12px 24px;

  &.selected {
    background: #1f9898;
    border-radius: 12px;
    color: white;
  }
`

export const Container = styled(Box)`
  width: 100%;
  max-width: 1440px;
  padding: 26px 45px;
`
export const Title = styled(Typography)`
  font-size: 24px;
  line-height: 36px;
  font-family: 'Monument Extended';
`

export default function Testnet() {
  const [currentTab, setTab] = useState<number>(0)
  return (
    <>
      <Tab marginTop={-54}>
        <TabItem onClick={() => setTab(0)} className={currentTab == 0 ? 'selected' : ''}>
          Farms
        </TabItem>
        <TabItem onClick={() => setTab(1)} className={currentTab == 1 ? 'selected' : ''}>
          NFT staking
        </TabItem>
      </Tab>
      {currentTab == 0 && <Farms />}
      {currentTab == 1 && <NFTStaking />}
    </>
  )
}

function Farms() {
  return (
    <Container>
      <Title>Farms</Title>
      <Typography>Stake ERC20 and NFT Liquidity Pool (LP) tokens to earn LAD.</Typography>
      <TestNetCardList list={FakeData} />
    </Container>
  )
}

function NFTStaking() {
  return (
    <Container>
      <Title>NFT Staking</Title>
      <Typography>Stake Token To Get LAD Rewards</Typography>
      <TestNetCardList list={FakeData} />
    </Container>
  )
}
