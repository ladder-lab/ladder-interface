import HeadBg from 'assets/images/bg-home-head.png'
import Temp3 from 'assets/images/temp-3.png'
import { Button, Stack, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Twitter from 'assets/svg/socials/twitter.svg'
import Discord from 'assets/svg/socials/discord.svg'
import Web from 'assets/svg/socials/website.svg'
import OrigTemp from 'assets/images/orig-temp.png'
import OrigTemp1 from 'assets/images/orig-temp1.png'
import ColorBg from 'assets/images/grain-colorful-shape.png'
import { ReactComponent as LadderLogo } from 'assets/svg/ladder-logo.svg'
import { ReactComponent as StarryniftLogo } from 'assets/svg/starrynift-logo.svg'
import Divider from '../../components/Divider'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import useModal from '../../hooks/useModal'
import MintOrganModal from './MintOrganModal'
import useBreakpoint from '../../hooks/useBreakpoint'

const Head = styled(Box)`
  background-image: url('${HeadBg}');
  background-size: cover;
  width: 100%;
  padding: 130px 130px 130px 86px;
  display: flex;
  justify-content: space-between;
`
const SocialBg = styled(Box)`
  background: #f6f6f6;
  border-radius: 8px;
  padding: 13px;
  width: 44px;
  height: 44px;
`

const OrigCardBg = styled(Box)`
  background-color: #f9f9f9;
  border-radius: 16px;
  text-align: left;
`

function OrigCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  const isDownSm = useBreakpoint('sm')
  return (
    <OrigCardBg width={isDownSm ? '95%' : '50%'} alignSelf={isDownSm ? 'center' : 'auto'}>
      <img src={img} style={{ width: '100%', height: 'auto', borderRadius: '16px 16px 0 0' }} />
      <Typography mt={32} ml={46} variant={'h5'}>
        {title}
      </Typography>
      <Typography mt={20} ml={46} mb={29} fontSize={16} fontWeight={500}>
        {desc}
      </Typography>
    </OrigCardBg>
  )
}

const ReferralBg = styled(Box)`
  margin-bottom: 36px;
  margin-top: 48px;
  width: 100%;
  background-color: black;
  background-image: url('${ColorBg}');
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 100px 0;
`
const Row = styled(Box)`
  display: flex;
`
const ColorText = styled(Typography)`
  margin-left: 6px;
  font-size: 20px;
  text-decoration-line: underline;
  background: linear-gradient(96.44deg, #d8ff20 5.94%, #99f7f4 97.57%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

function Referral() {
  const isDownSm = useBreakpoint('sm')
  return (
    <ReferralBg>
      <Row display={'flex'} gap={isDownSm ? 4 : 60} flexDirection={isDownSm ? 'column' : 'row'}>
        <StarryniftLogo />
        <Typography fontSize={43} color={'white'}>
          X
        </Typography>
        <LadderLogo />
      </Row>
      <Row alignItems={isDownSm ? 'center' : 'flex-end'} flexDirection={isDownSm ? 'column' : 'row'}>
        <Typography fontSize={20} color={'white'}>
          Referral link:
        </Typography>
        <ColorText>http://terrapass.com/individuals</ColorText>
      </Row>
    </ReferralBg>
  )
}

const ActBg = styled(Box)`
  width: 95%;
  margin-bottom: 40px;
  background: #f9f9f9;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 40px;
`

function ActRow(props: { time: string; address: string; type: string }) {
  return (
    <Box width={'100%'}>
      <Divider />
      <Row gap={'14vw'} color={'#878D92'} padding={'20px 0'}>
        <Typography>{props.time}</Typography>
        <Typography>{props.address}</Typography>
        <Typography>{props.type}</Typography>
      </Row>
    </Box>
  )
}

function Activity() {
  return (
    <ActBg>
      <Typography variant={'h1'} mb={32}>
        Activity
      </Typography>
      {Array(15)
        .fill({ time: 'June 15, 2020 08:22', address: '0xb24...6f8b', type: 'Mint' })
        .map((row, idx) => (
          <ActRow key={idx} time={row.time} address={row.address} type={row.type} />
        ))}
      <Divider />
      <Row mt={20}>
        <ArrowLeft />
        <Typography>Page 1 of 5</Typography>
        <ArrowRight />
      </Row>
    </ActBg>
  )
}

export default function OrigAccount() {
  const { showModal, hideModal } = useModal()
  const isDownSm = useBreakpoint('sm')
  const SocialList = [
    {
      type: 'twitter',
      icon: Twitter,
      link: ''
    },
    {
      type: 'discord',
      icon: Discord,
      link: ''
    },
    {
      type: 'web',
      icon: Web,
      link: ''
    }
  ]
  const fakeIntroList = [
    {
      img: OrigTemp,
      title: 'introduction to Starry',
      desc: 'It is super easy to mint your Ladder Owner SBT! Generate your Decentralized Identity now and bind your SBT to your wallet address and enjoy what Ladder Protocol can offer you.'
    },
    {
      img: OrigTemp1,
      title: 'introduction to Ladder',
      desc: 'Refer more friends and when they mint their SBT with your referral code, your SBT credential and incentives increase based on their on-chain behaviors.'
    }
  ]
  const organImg = <img src={Temp3} style={{ width: isDownSm ? '70vw' : '28vw', height: isDownSm ? '70vw' : '28vw' }} />

  return (
    <Box width={'100%'} sx={{ backgroundColor: 'white' }}>
      <Head>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isDownSm ? 'center' : 'start'
          }}
        >
          <Stack direction={'row'} spacing={20}>
            {SocialList.map((social, index) => {
              return (
                <SocialBg key={index}>
                  <img src={social.icon} />
                </SocialBg>
              )
            })}
          </Stack>
          <Typography variant={'h1'} mt={31}>
            StarryNift x Ladder
          </Typography>
          <Typography mt={19}>
            Mint a StarryNift X Ladder SBT! SBT holders will continue to share the benefits of Ladder Protocol.
          </Typography>
          {isDownSm && organImg}
          <Box
            display={'flex'}
            mt={57}
            alignItems={isDownSm ? 'center' : 'baseline'}
            flexDirection={isDownSm ? 'column' : 'row'}
          >
            <Typography>Total Minted:</Typography>
            <Typography variant={'h1'}>98214912</Typography>
          </Box>
          <Box gap={37} mt={45} display={'flex'}>
            <Button onClick={() => showModal(<MintOrganModal hide={hideModal} />)}>Mint</Button>
            <Button variant={'outlined'}>View the collection</Button>
          </Box>
        </Box>
        {!isDownSm && organImg}
      </Head>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} textAlign={'center'}>
        <Typography variant={'h1'} mt={56}>
          Why StarryNift x Ladder
          <br />
          Owner SBT ?
        </Typography>
        <Typography fontWeight={500} fontSize={16} mt={20}>
          Ladder Owner SBT is a soul-bound token issued by Ladder & Our Partners.
          <br />
          SBT holders will continue to share the benefits of Ladder Protocol.
        </Typography>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          gap={20}
          mt={48}
          flexDirection={isDownSm ? 'column' : 'row'}
        >
          {fakeIntroList.map((orig, idx) => {
            return <OrigCard key={idx} img={orig.img} title={orig.title} desc={orig.desc} />
          })}
        </Box>
        <Referral />
        <Activity />
      </Box>
    </Box>
  )
}
