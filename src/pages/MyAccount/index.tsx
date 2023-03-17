import AppBody from '../../components/AppBody'
import { useNavigate } from 'react-router-dom'
import { Button, Stack, styled, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Illustration from 'assets/images/illustration.png'
import { useState } from 'react'
import tempImg from 'assets/images/illustration.png'
import Share from 'assets/svg/share-2.svg'
import Divider from '../../components/Divider'

const HeadBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f6f6f6;
  border-radius: 16px;
  text-align: center;
  padding: 32px 0 53px 0;
  margin-top: 24px;
`
const WhiteBg = styled(Box)`
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  margin-top: 20px;
  margin-bottom: 128px;
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
        sx={{ padding: { xs: '20px', md: '24px 32px' }, marginBottom: '20px' }}
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
        {currentTab == btnList[0] && <MyOwnedSbt route={''} />}
        {currentTab == btnList[1] && <InvitationReward />}
        {currentTab == btnList[2] && <Invited />}
      </WhiteBg>
    </Box>
  )
}

function MyOwnedSbt({ route }: { route: string }) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        position: 'relative',
        height: 'auto',
        maxWidth: 218,
        width: 218,
        backgroundColor: 'white',
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => navigate(route)}
    >
      <Box
        component="img"
        sx={{
          height: 168,
          display: 'block',
          width: '100%',
          padding: '12px',
          objectFit: 'cover'
        }}
        src={tempImg}
        alt={'Token logo'}
      />
      <Box sx={{ padding: 16 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <img />
          <Box display={'flex'}>
            <Typography mr={8} color={theme.palette.text.secondary}>
              Share
            </Typography>
            <img src={Share} />
          </Box>
        </Box>
        <Typography sx={{ mt: 12, color: '#333333', fontWeight: '700' }}>StarryNift X Ladder</Typography>
      </Box>
    </Box>
  )
}

function InvitationItem() {
  const Text1 = styled(Typography)`
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #878d92;
  `
  const Text2 = styled(Typography)`
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #333333;
  `
  return (
    <Box>
      <Divider />
      <Box display={'flex'}>
        <Text1>June 15, 2020 08:22</Text1>
        <Text2>256.25 LAD</Text2>
      </Box>
    </Box>
  )
}

function Summarize({ title, count }: { title: string; count: string }) {
  const TotalRewardBg = styled(Box)`
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex - start;
    max-width: 420px;
    padding: 24px 160px 24px 24px;
    gap: 4px;
    background: #f6f6f6;
    border-radius: 12px;
  `
  return (
    <TotalRewardBg>
      <Typography color={'#333333'} fontSize={20}>
        {title}
      </Typography>
      <Typography color={'#333333'} fontSize={32} fontWeight={600}>
        {count}
      </Typography>
    </TotalRewardBg>
  )
}

function InvitationReward() {
  return (
    <Box mt={32}>
      <Summarize title={'Invitation total reward:'} count={'67,619'} />
      <InvitationItem />
    </Box>
  )
}

function Invited() {
  return (
    <Box mt={32}>
      <Box display={'flex'} gap={20} mb={24}>
        <Summarize title={'Invited:'} count={'258'} />
        <Summarize title={'total invited:'} count={'1,288'} />
      </Box>
      <InvitationItem />
    </Box>
  )
}
