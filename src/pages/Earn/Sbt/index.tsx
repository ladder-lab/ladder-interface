import Box from '@mui/material/Box'
import { Button, Grid, Stack, styled, Typography } from '@mui/material'
import HeadDeco from 'assets/images/head-deco-img.png'
import HeadBg from 'assets/images/sbt-bg.png'
import DescPic from 'assets/images/sbt-desc-pic.png'
import HowToPic from 'assets/images/sbt-how-to-bg.png'
import CheckBg from 'assets/images/sbt-check-bg.jpg'
import CheckPic from 'assets/images/sbt-check-pic.png'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../../constants/routes'
import { useActiveWeb3React } from '../../../hooks'
import Web3Status from '../../../components/Header/Web3Status'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { useIsDarkMode } from '../../../state/user/hooks'
import { SbtListResult, useGetSbtList } from '../../../hooks/useGetSbtList'
import CarouselSwiper from '../../../components/Swiper'
import HeadCardBg from 'assets/images/head-cards-bg.jpg'
import Twitter from 'assets/svg/socials/twitter.svg'
import { Row } from '../../MyAccount/OrigAccount'
import { useSignLogin } from '../../../hooks/useSignIn'

const Head = styled(Box)`
  width: 100%;
  background-size: cover;
  background-image: url('${HeadBg}');
`
const HeadCard = styled(Box)`
  width: 100%;
  background-size: cover;
  background-image: url('${HeadCardBg}');
`
const AlignCenter = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const UnderlineText = styled('span')`
  background-image: linear-gradient(to right, #d8ff20, #99f7f4);
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: auto 20px;
`
const ContentText = styled(Typography)`
  color: #878d92;
`
export default function Sbt() {
  const isDownSm = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const isDarkMode = useIsDarkMode()
  const { result } = useGetSbtList()

  const HeadBoxStyle = {
    display: 'flex',
    justifyContent: isDownSm ? 'start' : 'space-between',
    flexDirection: isDownSm ? 'column-reverse' : 'row'
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: isDarkMode ? 'black' : 'white'
      }}
    >
      <Head>
        <Box sx={HeadBoxStyle}>
          <Box paddingLeft={45}>
            <Typography variant="h1" sx={{ mt: 92 }}>
              Earn up to
              <br /> %X of trading fees
              <br /> as a Ladder Partner
            </Typography>
            <Typography mt={24} mb={37}>
              Join Affiliate Program and build NFT liquidity together with Ladder
            </Typography>
            {!account && <Web3Status />}
          </Box>
          <img src={HeadDeco} alt={'head-deco'} />
        </Box>
        <HeadCard>
          <CollectionListing collections={result} />
        </HeadCard>
      </Head>
      <AlignCenter padding={48}>
        <Typography variant="h1" textAlign={'center'}>
          What is ladder
          <br /> owner <UnderlineText>SBT</UnderlineText>?
        </Typography>
        <ContentText textAlign={'center'} width={'63%'} mt={26}>
          These SBT tokens are permanently linked to holder&apos;s wallet, making them non-transferable and serve as
          Decentralized Identity within Ladder ecosystems that records personal credentials and reputation. With Ladder
          Owner SBT, holders are entitled into Ladder ecosystem and membership system which automatically execute
          rewards and other incentivization mechanisms.
        </ContentText>
      </AlignCenter>
      <Box padding={'0 45px 51px 45px'}>
        <Grid container spacing={20} direction={'row'}>
          <Grid item md={6} sm={12}>
            <DescCard
              range={'01'}
              title={'Mint your SBT'}
              desc={
                'It is super easy to mint your Ladder Owner SBT! Generate your Decentralized Identity now and bind your SBT to your wallet address and enjoy what Ladder Protocol can offer you.'
              }
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <DescCard
              range={'02'}
              title={'Refer your friend'}
              desc={
                'Refer more friends and when they mint their SBT with your referral code, your SBT credential and incentives increase based on their on-chain behaviors.'
              }
            />
          </Grid>
          <Grid item md={12} sm={12}>
            <DescCard
              range={'03'}
              title={'Get your rewards'}
              desc={
                "The Ladder Owner SBT plays a big role in the Ladder ecosystem. It records the holder's behavior on-chain and the more contributions the holder make, the higher the credential and rewards the holder will get."
              }
              pic={DescPic}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <HowTo />
        <CheckSbt />
        <MainBenefits />
      </Box>
    </Box>
  )
}

function CollectionListing({ collections }: { collections: SbtListResult[] }) {
  const navigate = useNavigate()
  console.log(navigate)

  const items = collections.map(({ logo, name, follows, amount }, index: number) => (
    <Box
      key={index}
      sx={{
        position: 'relative',
        height: 280,
        maxWidth: 218,
        width: 218,
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => navigate(routes.origAccount, { state: collections[index] })}
    >
      <Box
        component="img"
        sx={{
          height: 168,
          display: 'block',
          width: '100%',
          objectFit: 'cover'
        }}
        src={logo}
        alt={'Token logo'}
      />
      <Box sx={{ padding: 16 }}>
        <Typography sx={{ mb: 9, color: '#333333', fontWeight: '700' }}>{name}</Typography>
        <Row mb={12}>
          <img src={Twitter} style={{ width: '16px', height: '16px' }} />
          <Typography sx={{ color: 'rgba(51, 51, 51, 0.5)', textDecoration: 'underline', marginLeft: '12px' }}>
            {follows}followers
          </Typography>
        </Row>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: '#878D92' }}>SBT</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#333333' }}>{amount}</Typography>
        </Box>
      </Box>
    </Box>
  ))

  return (
    <Box
      sx={{
        padding: '33px 45px',
        position: 'relative'
      }}
    >
      <CarouselSwiper itemWidth={218} items={items} darkMode />
    </Box>
  )
}

function DescCard({ range, title, desc, pic }: { range: string; title: string; desc: string; pic?: string }) {
  const isDownSm = useBreakpoint('sm')
  const Bg = styled(Box)`
    display: flex;
    justify-content: space-between;
    background: #f9f9f9;
    height: 100%;
    border-radius: 16px;
    padding: 10px 81px 77px 48px;
  `
  const RangeText = styled(Typography)`
    font-size: 70px;
    background: linear-gradient(96.44deg, #d8ff20 5.94%, #99f7f4 97.57%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `
  return (
    <Bg flexDirection={isDownSm ? 'column' : 'row'}>
      <Box>
        <RangeText variant={'h1'}>{range}</RangeText>
        <Typography variant={'h5'} mt={-46}>
          {title}
        </Typography>
        <ContentText mt={20}>{desc}</ContentText>
      </Box>
      {pic && <img src={pic} alt={'pic'} />}
    </Bg>
  )
}

function HowTo() {
  const isDownSm = useBreakpoint('sm')
  const navigate = useNavigate()
  const Bg = styled(Box)`
    background-color: #110e12;
    background-image: url('${HowToPic}');
    background-position: center;
    background-repeat: no-repeat;
    padding-bottom: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  const btnStyle = {
    width: 'max-content',
    minWidth: isDownSm ? '160px' : '220px'
  }
  return (
    <Bg
      sx={{
        borderRadius: isDownSm ? 0 : '24px 24px 0 0'
      }}
    >
      <Typography variant={'h1'} color={'white'} m={'70px 0 31px'} textAlign={'center'}>
        How to <br />
        become a ladder Partner?
      </Typography>
      <Stack spacing={55} direction={'row'}>
        <Button
          style={btnStyle}
          onClick={() => {
            navigate(routes.becomePartner)
          }}
        >
          Apply Now
        </Button>
        <Button style={btnStyle} variant={'outlined'}>
          More detail
        </Button>
      </Stack>
    </Bg>
  )
}

function CheckSbt() {
  const navigate = useNavigate()
  const isDownSm = useBreakpoint('sm')
  const { account } = useActiveWeb3React()
  const { token, sign } = useSignLogin()
  const Bg = styled(Box)`
    background-image: url('${CheckBg}');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
    width: 100%;
  `
  const pic = (
    <img
      src={CheckPic}
      style={{
        width: isDownSm ? '80vw' : '26vw',
        height: 'auto'
      }}
    />
  )
  return (
    <Bg>
      <Stack direction={'row'} spacing={100}>
        {!isDownSm && pic}
        <Box>
          <Typography variant={'h1'} mb={46}>
            <UnderlineText>Check</UnderlineText> your SBT
            <br /> and <UnderlineText>invite</UnderlineText> earnings
          </Typography>
          {isDownSm && pic}
          {account ? (
            <Button
              onClick={() => {
                if (!token) {
                  sign().then(() => {
                    navigate(routes.myAccount)
                  })
                } else {
                  navigate(routes.myAccount)
                }
              }}
            >
              My Account
            </Button>
          ) : (
            <Web3Status />
          )}
        </Box>
      </Stack>
    </Bg>
  )
}

function MainBenefits() {
  const isDownSm = useBreakpoint('sm')
  const benefitsList = [
    {
      title: 'Ladder Reputable Member',
      desc: 'Holders of the Ladder Owner SBT are esteemed member of the Ladder Protocol and the associated ecosystem. It grants holders guaranteed access to exclusive experiences within Ladder ecosystem. Holding the SBT will have higher voting weight on staked governance tokens.'
    },
    {
      title: 'Smooth Authenticity of Identity',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.'
    },
    {
      title: 'Credentials, Decentralized Identity and Accolades',
      desc: "As SBT introduces a system of merit where digital assets cannot be bought at any price and each holders has to work to earn that credential, it is a testament of the holder's effort. This recognition cannot be traded or exchanged."
    },
    {
      title: 'SBT Leaderboard',
      desc: 'Pit against other SBT holders to see how you fare in the Ladder Protocol and Ecosystem.'
    }
  ]
  return (
    <Box mt={89} padding={isDownSm ? '20px' : '45px'}>
      <Typography variant={'h1'} textAlign={isDownSm ? 'center' : 'left'}>
        What are the
        <br />
        <UnderlineText> main benefits</UnderlineText> of the Ladder
        <br /> owner SBT program
      </Typography>
      <Grid container spacing={20} mt={50}>
        {benefitsList.map((val, index) => {
          return (
            <Grid item md={6} sm={12} key={index}>
              <Box
                sx={{
                  background: '#F9F9F9',
                  height: '100%',
                  padding: '56px 64px 61px 48px',
                  borderRadius: '20px'
                }}
              >
                <Typography variant={'h5'}>{val.title}</Typography>
                <Typography mt={24}>{val.desc}</Typography>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
