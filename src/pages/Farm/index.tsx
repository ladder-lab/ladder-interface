import { Box, styled, Typography, useTheme, Stack, Button } from '@mui/material'
import { useState } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
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

// const Tab = styled(Row)(({ theme }) => ({
//   background: 'white',
//   width: '100%',
//   padding: '18px 45px',
//   gap: '24px',
//   [theme.breakpoints.down('md')]: {
//     padding: '18px 20px'
//   }
// }))
// const TabItem = styled(Typography)(({ theme }) => ({
//   fontSize: '16px',
//   padding: '12px 24px',
//   cursor: 'pointer',
//   '&.selected': {
//     background: '#1f9898',
//     borderRadius: '12px',
//     color: 'white'
//   },
//   [theme.breakpoints.down('md')]: {
//     padding: '10px 24px'
//   }
// }))

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
  const theme = useTheme()
  const isDownMD = useBreakpoint('md')
  const [currentTab, setTab] = useState<number>(0)
  return (
    <>
      {/* <Tab>
        <TabItem onClick={() => setTab(0)} className={currentTab == 0 ? 'selected' : ''}>
          Farms11
        </TabItem>
        <TabItem onClick={() => setTab(1)} className={currentTab == 1 ? 'selected' : ''}>
          NFT staking
        </TabItem>
      </Tab> */}
      <Box
        sx={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            background: theme.palette.background.paper,
            width: '100%',
            padding: '18px 0'
          }}
        >
          <Stack
            direction={'row'}
            flexWrap="wrap"
            spacing={20}
            sx={{
              width: '100%',
              maxWidth: '1350px',
              margin: '0 auto'
            }}
          >
            {['Farms', 'NFT staking'].map((item, index) => (
              <Button
                sx={{
                  width: 'fit-content',
                  height: isDownMD ? 36 : 52,
                  fontSize: { xs: 13, sm: 16 },
                  fontWeight: isDownMD ? '500' : 'inherit',
                  color: currentTab === index ? 'white' : '#343739',
                  borderRadius: '12px',
                  background: currentTab === index ? '#1F9898 !important' : 'inherit',
                  position: isDownMD ? 'relative' : 'inherit',
                  '&:hover': {
                    boxShadow: 'unset',
                    background: currentTab === index ? '#1F9898' : '#F6F6F6'
                  }
                }}
                key={item}
                onClick={() => {
                  setTab(index)
                }}
                variant={currentTab === index ? 'contained' : 'text'}
              >
                {item}
              </Button>
            ))}
          </Stack>
        </Box>
      </Box>
      {currentTab == 0 && <Farms />}
      {currentTab == 1 && <NFTStaking />}
    </>
  )
}
