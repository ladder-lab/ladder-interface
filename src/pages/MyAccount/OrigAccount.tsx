import HeadBg from 'assets/images/bg-home-head.png'
import Temp3 from 'assets/images/temp-3.png'
import { Button, Stack, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Twitter from 'assets/svg/socials/twitter.svg'
import Discord from 'assets/svg/socials/discord.svg'
import Web from 'assets/svg/socials/website.svg'
import OrigTemp from 'assets/images/orig-temp.png'
import OrigTemp1 from 'assets/images/orig-temp1.png'

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
  return (
    <OrigCardBg>
      <img src={img} />
      <Typography>{title}</Typography>
      <Typography>{desc}</Typography>
    </OrigCardBg>
  )
}

export default function OrigAccount() {
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
  return (
    <Box width={'100%'} sx={{ backgroundColor: 'white' }}>
      <Head>
        <Box>
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
          <Box display={'flex'} mt={57} alignItems={'baseline'}>
            <Typography>Total Minted:</Typography>
            <Typography variant={'h1'}>98214912</Typography>
          </Box>
          <Box gap={37} mt={45} display={'flex'}>
            <Button>Mint</Button>
            <Button variant={'outlined'}>View the collection</Button>
          </Box>
        </Box>
        <img src={Temp3} style={{ width: '28vw', height: '28vw' }} />
      </Head>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} textAlign={'center'}>
        <Typography variant={'h1'}>
          Why StarryNift x Ladder
          <br />
          Owner SBT ?
        </Typography>
        <Typography fontWeight={500} fontSize={16}>
          Ladder Owner SBT is a soul-bound token issued by Ladder & Our Partners.
          <br />
          SBT holders will continue to share the benefits of Ladder Protocol.
        </Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          {fakeIntroList.map((orig, idx) => {
            return <OrigCard key={idx} img={orig.img} title={orig.title} desc={orig.desc} />
          })}
        </Box>
      </Box>
    </Box>
  )
}
