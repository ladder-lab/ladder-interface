import { Box, Button, Grid, Stack, styled, Typography } from '@mui/material'
import Head from 'assets/svg/bg/sbt_head.png'
import SbtIcon from 'assets/images/sbt_icon.png'
import DescSbt from 'assets/svg/desc_icon_sbt.svg'
import DescRewards from 'assets/svg/desc_icon_rewards.svg'
import DescChian from 'assets/svg/desc_icon_chian.svg'
import SbtDeco from 'assets/images/sbt_deco.png'

const ContentWrapper = styled(Box)`
  width: 100%;
  height: 100%;
`
const RelativeBox = styled(Box)`
  display: flex;
  width: 100%;
  height: 437px;
  background-color: white;
  background-image: url(${Head});
`
export const BlackText = styled(Typography)`
  color: #333333;
`
const BlackCard = styled(Box)`
  border-radius: 20px;
  background: #333333;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: -60px 0 160px 0;
  padding: 52px 40px 62px 40px;
`
const WhiteText = styled(Typography)`
  color: white;
`
const FlexBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #494949;
  padding: 37px 20px;
  border-radius: 20px;
  align-items: center;
`
const FlexWrap = styled(Box)`
  margin-top: 36px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`

const CenterBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function SBTCube({ icon, amount }: { icon: string; amount: string }) {
  return (
    <FlexBox>
      <img src={icon} />
      <WhiteText fontSize={20} mt={16}>
        {amount}
      </WhiteText>
    </FlexBox>
  )
}

const SpaceBtwBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const DescCardBg = styled(Box)`
  background-color: #f6f6f6;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
`
const WhiteBg = styled(Box)`
  background-color: white;
  width: 100%;
`

function DescCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <DescCardBg>
      <img src={icon} />
      <Box>
        <BlackText fontSize={20}>{title}</BlackText>
        <BlackText fontSize={16} mt={12}>
          {desc}
        </BlackText>
      </Box>
    </DescCardBg>
  )
}

function BenefitsCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Box sx={{ backgroundColor: '#F6F6F6', padding: '45px' }}>
      <BlackText fontSize={20}>{title}</BlackText>
      <BlackText fontSize={16}>{desc}</BlackText>
    </Box>
  )
}

export default function Sbt() {
  const fakeData = [
    {
      icon: SbtIcon,
      amount: '1, 536 SBT’S'
    },
    {
      icon: SbtIcon,
      amount: '1, 536 SBT’S'
    },
    {
      icon: SbtIcon,
      amount: '1, 536 SBT’S'
    },
    {
      icon: SbtIcon,
      amount: '1, 536 SBT’S'
    },
    {
      icon: SbtIcon,
      amount: '1, 536 SBT’S'
    }
  ]
  const fakeDesc = [
    {
      icon: DescSbt,
      title: 'Claim your SBT',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.'
    },
    {
      icon: DescChian,
      title: 'Referral your friend',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.'
    },
    {
      icon: DescRewards,
      title: 'Get Rewards',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.'
    }
  ]
  const fakeBenefits = [
    {
      title: 'Benefit header',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.'
    },
    {
      title: 'Exclusive mining pool',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.'
    },
    {
      title: 'Benefit header',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.'
    },
    {
      title: 'Benefit header',
      desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.'
    }
  ]
  return (
    <ContentWrapper>
      <RelativeBox justifyContent={'center'}>
        <BlackText fontSize={45} alignSelf={'center'}>
          Build NFT liquidity with Ladder
        </BlackText>
      </RelativeBox>
      <WhiteBg>
        <BlackCard>
          <WhiteText fontSize={32}>Mint your SBT</WhiteText>
          <WhiteText fontSize={20} mt={16}>
            Mint your first SBT from the Ladder Partner
          </WhiteText>
          <FlexWrap>
            {fakeData.map((item, index) => {
              return <SBTCube icon={item.icon} amount={item.amount} key={index} />
            })}
          </FlexWrap>
        </BlackCard>
        <SpaceBtwBox>
          <Box>
            <BlackText fontSize={32}>What is Ladder Owner SBT</BlackText>
            <BlackText fontSize={20}>
              Ladder Owner SBT is a soul-bound token issued by Ladder & Our Partners. SBT holders will continue to share
              the benefits of Ladder Protocol.
            </BlackText>
          </Box>
          <Stack gap={13}>
            {fakeDesc.map((item, index) => {
              return <DescCard icon={item.icon} title={item.title} desc={item.desc} key={index} />
            })}
          </Stack>
        </SpaceBtwBox>
        <CenterBox sx={{ backgroundColor: '#F0F9F9' }}>
          <Typography color={'#1F9898'} fontSize={32}>
            How to Become a Ladder Partner
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Button>Apply Now</Button>
            <Button variant={'outlined'}>More Detail</Button>
          </Box>
        </CenterBox>
        <SpaceBtwBox>
          <img src={SbtDeco} />
          <Box>
            <BlackText fontSize={32}>Check your SBT and invite earnings!</BlackText>
            <Button variant={'outlined'}>My Account</Button>
          </Box>
        </SpaceBtwBox>
        <BlackText>
          What are the main benefits <br /> of the Ladder Owner SBT Program
        </BlackText>
        <Grid container gap={16}>
          {fakeBenefits.map((item, index) => {
            return (
              <Grid item md={5} key={index}>
                <BenefitsCard title={item.title} desc={item.desc} />
              </Grid>
            )
          })}
        </Grid>
      </WhiteBg>
    </ContentWrapper>
  )
}
