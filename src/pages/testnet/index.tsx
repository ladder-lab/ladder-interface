import { Box, styled, Typography } from '@mui/material'
import { useState } from 'react'
import Farms from './Farms'
import NFTStaking from './NFTStaking'

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
export default function TestnetFarm() {
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
