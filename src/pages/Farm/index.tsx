import { Box, styled, Typography } from '@mui/material'
import { useState } from 'react'
import NFTStaking from './NFTStaking'
import Farms from './Farms'

export const Row = styled(Box)`
  display: flex;
`
export const CenterRow = styled(Row)`
  align-items: center;
`

export const CenterBetweenRow = styled(CenterRow)`
  justify-content: space-between;
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
  cursor: pointer;
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
export enum CardTYPE {
  box,
  nft
}

export default function Index() {
  const [currentTab, setTab] = useState<number>(0)
  return (
    <>
      <Tab>
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
