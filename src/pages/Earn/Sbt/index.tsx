import Box from '@mui/material/Box'
import { Button, Grid, Stack, styled, Typography } from '@mui/material'
import HeadDeco from 'assets/images/head-deco-img.png'
import HeadCardsBg from 'assets/images/head-cards-bg.jpg'
import HeadBg from 'assets/images/sbt-bg.jpg'
import DescPic from 'assets/images/sbt-desc-pic.png'
import HowToPic from 'assets/images/sbt-how-to-bg.png'
import CheckBg from 'assets/images/sbt-check-bg.jpg'
import CheckPic from 'assets/images/sbt-check-pic.png'
import { useNavigate } from 'react-router-dom'
import TestnetV3Mark from '../../../components/TestnetV3Mark'
import Swiper from '../../../components/Swiper'
import { useMemo } from 'react'
import { formatMillion } from '../../../utils'
import { routes } from '../../../constants/routes'
import { Mode } from '../../../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { useTopPoolsList } from '../../../hooks/useStatBacked'
import { NETWORK_CHAIN_ID } from '../../../constants/chain'
import { useActiveWeb3React } from '../../../hooks'
import { PoolPairType, ShowTopPoolsCurrencyBox } from '../../Statistics'

const ContentWrapper = styled(Box)`
  background: white;
  width: 100%;
  height: 100vh;
`
const Head = styled(Box)`
  width: 100%;
  background-size: cover;
  background-image: url('${HeadBg}');
`
const HeadCard = styled(Box)`
  width: 100%;
  background-size: cover;
  background-image: url('${HeadCardsBg}');
`
const AlignCenter = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
export default function Sbt() {
  const { chainId } = useActiveWeb3React()

  const { result: list721Pool } = useTopPoolsList(
    chainId || NETWORK_CHAIN_ID,
    undefined,
    PoolPairType.ERC20_ERC721,
    undefined,
    10
  )
  const pool721Collection: CollectionsProp[] = useMemo(
    () =>
      list721Pool.map(item => ({
        title: (
          <ShowTopPoolsCurrencyBox
            chainId={chainId || NETWORK_CHAIN_ID}
            pair={item.pair}
            token0Info={item.token0}
            token1Info={item.token1}
            color={'#FFFFFF'}
            key={0}
          />
        ),
        imgPath: item.token0.type !== Mode.ERC20 ? item.token0.logo : item.token1.logo,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.statisticsPools + `/${chainId}/${item.pair}`,
        percentage: '',
        addresss: [item.token0.address, item.token1.address]
      })),
    [chainId, list721Pool]
  )

  return (
    <ContentWrapper width={'100%'}>
      <Head>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box paddingLeft={45}>
            <Typography variant="h1" sx={{ mt: 92 }}>
              Earn up to
              <br /> %X of trading fees
              <br /> as a Ladder Partner
            </Typography>
            <Typography mt={24} mb={37}>
              Join Affiliate Program and build NFT liquidity together with Ladder
            </Typography>
            <Button>Connect Wallet</Button>
          </Box>
          <img src={HeadDeco} alt={'head-deco'} />
        </Box>
        <HeadCard>
          <CollectionListing collections={pool721Collection} />
        </HeadCard>
      </Head>
      <AlignCenter padding={48}>
        <Typography variant="h1" textAlign={'center'}>
          What is ladder
          <br /> owner SBT?
        </Typography>
        <Typography textAlign={'center'} width={'63%'} mt={26}>
          These SBT tokens are permanently linked to holder&apos;s wallet, making them non-transferable and serve as
          Decentralized Identity within Ladder ecosystems that records personal credentials and reputation. With Ladder
          Owner SBT, holders are entitled into Ladder ecosystem and membership system which automatically execute
          rewards and other incentivization mechanisms.
        </Typography>
      </AlignCenter>
      <Box padding={'0 45px 51px 45px'} sx={{ backgroundColor: 'white' }}>
        <Grid container spacing={20} direction={'row'}>
          <Grid item xs={6}>
            <DescCard
              range={'01'}
              title={'Mint your SBT'}
              desc={
                'It is super easy to mint your Ladder Owner SBT! Generate your Decentralized Identity now and bind your SBT to your wallet address and enjoy what Ladder Protocol can offer you.'
              }
            />
          </Grid>
          <Grid item xs={6}>
            <DescCard
              range={'02'}
              title={'Refer your friend'}
              desc={
                'Refer more friends and when they mint their SBT with your referral code, your SBT credential and incentives increase based on their on-chain behaviors.'
              }
            />
          </Grid>
          <Grid item xs={12}>
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
        <HowTo />
        <CheckSbt />
        <MainBenefits />
      </Box>
    </ContentWrapper>
  )
}

interface CollectionsProp {
  title: string | JSX.Element
  route: string
  imgPath: string
  amount: string
  percentage: string
  address?: string[]
}

function CollectionListing({ collections }: { collections: CollectionsProp[] }) {
  const navigate = useNavigate()

  const items = collections.map(({ title, imgPath, amount, percentage, route, address }, index: number) => (
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
      onClick={() => navigate(route)}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 10,
          top: 10
        }}
      >
        <TestnetV3Mark addresss={address || []} />
      </Box>
      <Box
        component="img"
        sx={{
          height: 168,
          display: 'block',
          width: '100%',
          objectFit: 'cover'
        }}
        src={imgPath}
        alt={'Token logo'}
      />
      <Box sx={{ padding: 16 }}>
        <Typography sx={{ mb: 21, color: '#333333' }}>{title}</Typography>
        <Typography sx={{ color: 'rgba(51, 51, 51, 0.5)' }}>Total Liquidity</Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#333333' }}>{amount}</Typography>
          <Typography sx={{ fontSize: 14, color: 'rgba(51, 51, 51, 0.5)' }}>{percentage}</Typography>
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
      <Swiper itemWidth={218} items={items} darkMode />
    </Box>
  )
}

function DescCard({ range, title, desc, pic }: { range: string; title: string; desc: string; pic?: string }) {
  const Bg = styled(Box)`
    display: flex;
    justify-content: space-between;
    background: #f9f9f9;
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
    <Bg>
      <Box>
        <RangeText variant={'h1'}>{range}</RangeText>
        <Typography variant={'h5'} mt={-46}>
          {title}
        </Typography>
        <Typography mt={20}>{desc}</Typography>
      </Box>
      {pic && <img src={pic} alt={'pic'} />}
    </Bg>
  )
}

function HowTo() {
  const Bg = styled(Box)`
    background-color: #110e12;
    background-image: url('${HowToPic}');
    background-position: center;
    background-repeat: no-repeat;
    padding-bottom: 90px;
    display: flex;
    margin-top: 58px;
    border-radius: 24px 24px 0 0;
    flex-direction: column;
    align-items: center;
  `
  const btnStyle = {
    width: 'max-content',
    minWidth: '220px'
  }
  return (
    <Bg>
      <Typography variant={'h1'} color={'white'} m={'70px 0 31px'} textAlign={'center'}>
        How to <br />
        become a ladder Partner?
      </Typography>
      <Stack spacing={55} direction={'row'}>
        <Button style={btnStyle}>Apply Now</Button>
        <Button style={btnStyle} variant={'outlined'}>
          More detail
        </Button>
      </Stack>
    </Bg>
  )
}

function CheckSbt() {
  const Bg = styled(Box)`
    background-image: url('${CheckBg}');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
    width: 100%;
  `
  return (
    <Bg>
      <Stack direction={'row'} spacing={100}>
        <img
          src={CheckPic}
          style={{
            width: '26vw',
            height: 'auto'
          }}
        />
        <Box>
          <Typography variant={'h1'} mb={46}>
            Check your SBT
            <br /> and invite earnings
          </Typography>
          <Button>My Account</Button>
        </Box>
      </Stack>
    </Bg>
  )
}

function MainBenefits() {
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
    <Box mt={89}>
      <Typography variant={'h1'}>
        What are the
        <br />
        main benefits of the Ladder
        <br /> owner SBT program
      </Typography>
      <Grid container spacing={20} mt={50}>
        {benefitsList.map((val, index) => {
          return (
            <Grid item xs={6} key={index}>
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
