import AppBody from '../../components/AppBody'
import { useNavigate } from 'react-router-dom'
import { Button, Stack, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Illustration from 'assets/images/illustration.png'
import { useState } from 'react'

const HeadBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f6f6f6;
  border-radius: 16px;
  text-align: center;
  padding: 32px 0 53px 0;
`
const WhiteBg = styled(Box)`
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  margin-top: 20px;
`

const StyledTabButton = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  cursor: 'pointer',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.background.paper,
  padding: '6px 16px',
  borderRadius: '12px',
  marginRight: 8,
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

export default function MyAccount() {
  const navigate = useNavigate()
  const btnList = ['My Owned SBT', 'Invitation Reward', 'Invited']
  const [currentTab, setCurrentTab] = useState(btnList[0])
  return (
    <Box width={'77%'}>
      <AppBody
        width={'100%'}
        maxWidth={'1440px'}
        onReturnClick={() => navigate(-1)}
        title="My Account"
        sx={{ padding: { xs: '20px', md: '24px 32px' } }}
        setting
      >
        <HeadBox>
          <Typography variant={'h1'}>Refer your friend</Typography>
          <Typography mt={8}>
            Refer more friends and when they mint their SBT with your referral code, your SBT credential and incentives
            <br /> increase based on their on-chain behaviors.
          </Typography>
          <img src={Illustration} alt={''} style={{ margin: '23px' }} />
          <Stack direction={'row'} spacing={45}>
            <Button>Copy Your Referral link</Button>
            <Button variant={'outlined'}>View Invitation Reward Rules</Button>
          </Stack>
        </HeadBox>
      </AppBody>
      <WhiteBg>
        <Stack direction={'row'}>
          {btnList.map((text, idx) => {
            return (
              <StyledTabButton
                key={idx}
                className={text === currentTab ? 'active' : ''}
                onClick={() => {
                  setCurrentTab(text)
                }}
              >
                {text}
              </StyledTabButton>
            )
          })}
        </Stack>
      </WhiteBg>
    </Box>
  )
}
