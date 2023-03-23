import AppBody from '../../components/AppBody'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, Stack, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Illustration from 'assets/images/illustration.png'
import { useState } from 'react'
import LadderLogo from 'assets/svg/ladder_logo.svg'
// import Share from 'assets/svg/share-2.svg'
import Divider from '../../components/Divider'
import { useGetInvite, useInviteReward, useMySbt } from '../../hooks/useMySbt'
import useBreakpoint from '../../hooks/useBreakpoint'
import { Row } from './OrigAccount'
import { shortenAddress } from '../../utils'

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
  const isDownSm = useBreakpoint('sm')
  return (
    <Box width={isDownSm ? '90%' : '77%'}>
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
            {/*<Button>Copy Your Referral link</Button>*/}
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
                fontSize={isDownSm ? 12 : 16}
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
        {currentTab == btnList[0] && <MyOwnedSbt />}
        {currentTab == btnList[1] && <InvitationReward />}
        {currentTab == btnList[2] && <Invited />}
      </WhiteBg>
    </Box>
  )
}

function SbtCard(props: { route: string; tokenPic: string; tokenLogo: string; name: string }) {
  // const theme = useTheme()
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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => navigate(props.route)}
    >
      <img
        style={{
          display: 'block',
          width: '88%',
          marginTop: '12px',
          alignSelf: 'center',
          aspectRatio: '1/1',
          borderRadius: '12px'
        }}
        src={props.tokenPic}
        alt={'Token logo'}
      />
      <Box sx={{ padding: 16 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Row gap={8}>
            <img src={props.tokenLogo} style={{ width: '28px', aspectRatio: '1/1' }} />
            <img src={LadderLogo} style={{ width: '28px', aspectRatio: '1/1' }} />
          </Row>
          {/*<Box display={'flex'}>*/}
          {/*  <Typography mr={8} color={theme.palette.text.secondary}>*/}
          {/*    Share*/}
          {/*  </Typography>*/}
          {/*  <img src={Share} />*/}
          {/*</Box>*/}
        </Box>
        <Typography sx={{ mt: 12, color: '#333333', fontWeight: '700' }}>{props.name} X Ladder</Typography>
      </Box>
    </Box>
  )
}

function MyOwnedSbt() {
  const { result } = useMySbt()
  return (
    <Grid container mt={32}>
      {result.map((item, idx) => {
        return (
          <Grid item key={idx} md={3} sm={6}>
            <SbtCard route={''} tokenPic={item.logo} tokenLogo={item.logo} name={item.name} />
          </Grid>
        )
      })}
    </Grid>
  )
}

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

function RewardItem(props: { time: string; amount: string }) {
  const isDownSm = useBreakpoint('sm')
  return (
    <Box>
      <Divider />
      <Box display={'flex'} gap={isDownSm ? 32 : 175} mt={18}>
        <Text1>{new Date(Number(props.time)).toLocaleString()}</Text1>
        <Text2>{props.amount} LAD</Text2>
      </Box>
    </Box>
  )
}

function InviteItem(props: { time: string; addr: string; type: string }) {
  const isDownSm = useBreakpoint('sm')
  return (
    <Box>
      <Divider />
      <Box display={'flex'} gap={isDownSm ? 32 : 175} mt={18}>
        <Text1>{new Date(Number(props.time)).toLocaleString()}</Text1>
        <Text1>{shortenAddress(props.addr)}</Text1>
        <Text1>{props.type}</Text1>
      </Box>
    </Box>
  )
}

function Summarize({ title, count }: { title: string | undefined; count: string | undefined }) {
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
  const { result, totalReward } = useInviteReward()
  return (
    <Box mt={32}>
      <Summarize title={'Invitation total reward:'} count={totalReward} />
      <Box>
        {result.map((item, idx) => (
          <RewardItem key={idx} time={item.timestamp} amount={item.volume} />
        ))}
      </Box>
    </Box>
  )
}

function Invited() {
  const isDownSm = useBreakpoint('sm')
  const { result } = useGetInvite()
  return (
    <Box mt={32}>
      <Box display={'flex'} gap={20} mb={24} flexDirection={isDownSm ? 'column' : 'row'}>
        <Summarize title={'Invited:'} count={result?.invited} />
        <Summarize title={'total invited:'} count={result?.totalInvited} />
      </Box>
      {result?.list.map((item, idx) => (
        <InviteItem time={item.timestamp} addr={item.secondLevelAddress} type={'invitee'} key={idx} />
      ))}
    </Box>
  )
}
