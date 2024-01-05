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

const Tab = styled(Row)(({ theme }) => ({
  background: 'white',
  width: '100%',
  padding: '18px 45px',
  gap: '24px',
  [theme.breakpoints.down('md')]: {
    padding: '18px 20px'
  }
}))
const TabItem = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  padding: '12px 24px',
  cursor: 'pointer',
  '&.selected': {
    background: '#1f9898',
    borderRadius: '12px',
    color: 'white'
  },
  [theme.breakpoints.down('md')]: {
    padding: '10px 24px'
  }
}))

export const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1440px',
  padding: '26px 45px',
  [theme.breakpoints.down('md')]: {
    padding: '32px 20px'
  }
}))
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
