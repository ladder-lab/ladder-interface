import { Box, Button, Typography, styled, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import BlindBoxUrl from 'assets/images/blind_box.png'
import QuestionList from './QuestionList'
import { useIsDarkMode } from 'state/user/hooks'
import darkBg from 'assets/images/airdrop_bg_dark.png'
import { ReactComponent as Luck } from 'assets/svg/airdrop/luck.svg'
import { ReactComponent as LuckIcon } from 'assets/svg/airdrop/luck_icon.svg'
import { ReactComponent as BoxIcon } from 'assets/svg/airdrop/box_icon.svg'
import TaskListLuck from './TaskListLuck'
import TaskListBox from './TaskListBox'
import { useAirdropData } from 'hooks/useAirdrop'
import { useRef } from 'react'
import darkBg2 from 'assets/images/dark_bg.png'

const StyledLuck = styled(Luck)({})

const StyledWrapper = styled('div', { shouldForwardProp: prop => prop !== 'isDarkMode' })<{ isDarkMode: boolean }>(
  ({ isDarkMode }) => ({
    width: '100%',
    display: 'grid',
    gap: 60,
    paddingBottom: 100,
    position: 'relative',
    backgroundImage: isDarkMode ? `url(${darkBg})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: 'right top',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 800,
      backgroundSize: '100% 800px',
      backgroundImage: isDarkMode ? `url(${darkBg2})` : undefined,
      zIndex: -1,
      transform: 'rotate(180deg)',
      opacity: 0.6,
      transformOrigin: 'center center'
    }
  })
)

export default function Airdrop() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const { refreshCb, airdropData } = useAirdropData()
  const luckSection = useRef<HTMLDivElement>(null)
  const boxSection = useRef<HTMLDivElement>(null)

  return (
    <StyledWrapper isDarkMode={isDarkMode}>
      <Box
        sx={{
          // background: isDarkMode ? '#ffffff12' : '#ffffff32',

          width: '100%'
        }}
        padding={{ xs: 0, sm: '60px 24px' }}
      >
        <Box
          padding={'24px'}
          maxWidth={'1440px'}
          margin="0 auto"
          gap={{ xs: 20, xl: 80 }}
          sx={{
            // background: isDarkMode ? '#ffffff12' : '#ffffff32',
            display: { xs: 'grid', md: 'flex' },
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <Box maxWidth={600} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Typography
              fontSize={{ xs: 20, md: 26 }}
              my={30}
              variant="h5"
              sx={{ '& span': { color: theme.palette.primary.main } }}
            >
              Airdrop Rules Introduction
            </Typography>
            <Typography fontSize={20} sx={{ color: theme.palette.text.secondary }}>
              The Ladder Airdrop is designed to reward early supporters and active traders. The more you interact with
              our protocol, the higher your rewards will be! Complete the tasks below to receive more Ladder Boxes and
              increase your Luck!
            </Typography>
            <Box
              margin="40px 0"
              display={'flex'}
              gap={40}
              sx={{
                '*': {
                  color: theme.palette.primary.main
                }
              }}
            >
              {/* <Link
                to={'/airdrop#box'}
                onClick={() => {
                  const sec = boxSection.current
                  sec && window.scrollTo({ top: boxSection.current.offsetTop - 100, behavior: 'smooth' })
                }}
              >
                Get details
              </Link> */}
              <Link
                to={'/airdrop#qa'}
                onClick={() => {
                  const sec = luckSection.current
                  sec &&
                    window.scrollTo({
                      top: luckSection.current.offsetTop + luckSection.current.clientHeight,
                      behavior: 'smooth'
                    })
                }}
              >
                Q&A
              </Link>
            </Box>
            <Box
              sx={{
                mb: '20px',
                background: isDarkMode
                  ? 'linear-gradient(81deg, rgba(255, 255, 255, 0.49) 0%, rgba(255, 255, 255, 0.00) 100%)'
                  : 'linear-gradient(81deg, rgba(255, 255, 255, 0.49) 0%, rgba(255, 255, 255, 0.00) 100%)',
                borderRadius: 1.2,
                padding: '10px 20px'
              }}
            >
              Current Participants:{' '}
              <Typography component="span" fontWeight={700} fontSize={20}>
                {airdropData ? airdropData.totalBoxs : '--'}
              </Typography>
            </Box>
          </Box>
          <Box display="grid" gap={30} gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}>
            <Box
              maxWidth={{ xs: '100%', md: 300 }}
              width="100%"
              sx={{
                background: isDarkMode ? '#FFFFFF20' : '#FFFFFF60',
                borderRadius: 1.2,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box width="100%" display="grid" justifyItems={'center'}>
                <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
                  <BoxIcon />
                  YOUR BOXES
                  {/* <QuestionHelper
                  text="The Luck meter shows how likely it is for your boxes to contain better rewards! The more Luck you possess, the higher your chances of securing a top-tier reward. We have prepared separate tasks specifically designed to boost your Luck!"
                  style={{ background: 'transparent' }}
                /> */}
                </Typography>
                <Typography fontSize={32} fontWeight={700}>
                  {airdropData ? airdropData?.myBoxs : '--'}
                </Typography>
              </Box>
              <img src={BlindBoxUrl} style={{ transform: 'translateX(13%)', maxWidth: 220 }}></img>
              <Button
                onClick={() => {
                  const sec = boxSection.current
                  sec && window.scrollTo({ top: boxSection.current.offsetTop - 100, behavior: 'smooth' })
                }}
              >
                Get more
              </Button>
            </Box>
            <Box
              maxWidth={{ xs: '100%', md: 300 }}
              width="100%"
              sx={{
                background: isDarkMode ? '#FFFFFF20' : '#FFFFFF60',
                borderRadius: 1.2,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box width="100%" display="grid" justifyItems={'center'}>
                <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
                  <LuckIcon />
                  YOUR LUCK
                  {/* <QuestionHelper text="Answer" style={{ background: 'transparent' }} /> */}
                </Typography>
                <Typography fontSize={32} fontWeight={700} mb={15}>
                  {airdropData ? airdropData?.myLuck : '--'}%
                </Typography>
              </Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                sx={{
                  '& #needle': {
                    transition: '.5s',
                    transform: `rotate(${
                      -47 + ((136 + 47) / 300) * (airdropData?.myLuck ? Number(airdropData.myLuck) : 0)
                    }deg)`,
                    transformOrigin: 'center 95%'
                  }
                }}
              >
                <StyledLuck />
              </Box>
              <Typography fontSize={14} textAlign={'center'} mb={40}>
                {airdropData ? airdropData?.myLuck : '--'}%
              </Typography>
              <Button
                onClick={() => {
                  const sec = luckSection.current
                  sec && window.scrollTo({ top: luckSection.current.offsetTop - 100, behavior: 'smooth' })
                }}
              >
                Boost
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box id="box" ref={boxSection}>
        <TaskListBox refreshCb={refreshCb} />
      </Box>
      <Box id="luck" ref={luckSection}>
        <TaskListLuck refreshCb={refreshCb} />{' '}
      </Box>
      <QuestionList />
    </StyledWrapper>
  )
}
