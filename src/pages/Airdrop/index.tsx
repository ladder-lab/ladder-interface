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
import { useCallback, useEffect, useRef, useState } from 'react'
import darkBg2 from 'assets/images/dark_bg.png'
import QuestionHelper from 'components/essential/QuestionHelper'
import { useActiveWeb3React } from '../../hooks'
import useModal from '../../hooks/useModal'
import { Axios } from '../../utils/axios'
import BoxModal, { EmailModal, IncompleteModal } from './AirdropModal'
import { useTotal } from '../../graphql/useTotal'
import { useVerifyTwitter } from '../../hooks/useVerifyTwitter'
import TransacitonPendingModal from '../../components/Modal/TransactionModals/TransactionPendingModal'
// import ActivityBox from './Activity'
// import Mua from './Mua'

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

interface LuckItem {
  taskId: string
  description: string
  rewardBox: number
  rewardLuck: number
  expireTime: string
}
export interface BoxData {
  toClaim: LuckItem[]
  claimed: LuckItem[]
  expired: LuckItem[]
}

export enum LuckType {
  googleOauth = 'task_5',
  twitterOauth = 'task_6'
}
const useTaskList = (refreshCb: () => void) => {
  const { account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const [boxData, setBoxData] = useState<BoxData>({} as BoxData)
  const [lucksData, setLucksData] = useState<BoxData>({} as BoxData)
  const { openVerify } = useVerifyTwitter()

  const getTaskStatus = useCallback(async () => {
    try {
      const { data } = await Axios.get('/airdrop/getTaskStatus', {
        walletAddress: account ?? '0x',
        timestamp: new Date().toISOString()
      })
      const boxes = data.boxes
      const lucks = data.lucks
      setBoxData(boxes)
      setLucksData(lucks)
    } catch (e) {
      console.warn(e)
    }
  }, [account])

  const handleClaimBox = useCallback(
    async (item: any) => {
      showModal(<TransacitonPendingModal />)
      try {
        await Axios.post('/airdrop/claimBox', {
          walletAddress: account,
          taskId: item.taskId
        })
        hideModal()
        showModal(<BoxModal getBox={getTaskStatus} BoxId={item.id} />)
        if (refreshCb) {
          setTimeout(refreshCb)
        }
      } catch (e) {
        hideModal()
        showModal(<IncompleteModal route={item.route} link={item.link} scrollTo={item.scrollTo} />)

        console.warn(e)
      }
    },
    [account, getTaskStatus, showModal]
  )

  const handleClaimLuck = useCallback(
    async (item: any) => {
      showModal(<TransacitonPendingModal />)
      try {
        await Axios.post('/airdrop/claimLuck', {
          walletAddress: account,
          taskId: item.taskId
        })
        hideModal()
        showModal(<BoxModal getBox={getTaskStatus} BoxId={item.id} />)
        if (refreshCb) {
          setTimeout(refreshCb)
        }
      } catch (e) {
        hideModal()
        if (item.id === LuckType.googleOauth) {
          showModal(<EmailModal />)
        } else if (item.id === LuckType.twitterOauth) {
          openVerify()
        }
        console.warn(e)
      }
    },
    [account, getTaskStatus, showModal]
  )
  useEffect(() => {
    getTaskStatus()
  }, [getTaskStatus])
  return {
    boxData,
    lucksData,
    handleClaimBox,
    handleClaimLuck
  }
}

export default function Airdrop() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const { account } = useActiveWeb3React()
  const { airdropData, refreshCb } = useAirdropData()
  const luckSection = useRef<HTMLDivElement>(null)
  const boxSection = useRef<HTMLDivElement>(null)
  const { boxData, lucksData, handleClaimBox, handleClaimLuck } = useTaskList(refreshCb)
  const { data: totalData } = useTotal()

  useEffect(() => {
    refreshCb()
  }, [account])
  return (
    <StyledWrapper isDarkMode={isDarkMode}>
      <Box
        sx={{
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
            display: { xs: 'grid', md: 'flex' },
            width: '100%',
            justifyContent: 'space-between'
          }}
        >
          <Box maxWidth={600} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Typography
              fontSize={{ xs: 20, md: 32 }}
              lineHeight={1.5}
              my={20}
              variant="h5"
              sx={{ '& span': { color: theme.palette.primary.main } }}
            >
              Airdrop Rules Introduction
            </Typography>
            <Typography fontSize={16} lineHeight={1.3} sx={{ color: theme.palette.text.secondary }}>
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
                FAQ
              </Link>
            </Box>
            <Box
              fontSize={20}
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
              <Typography component="span" fontWeight={400} fontSize={20}>
                {totalData ? totalData.usersCount ?? '--' : '--'}
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
                  <Typography fontSize={18} fontWeight={500}>
                    YOUR BOXES
                  </Typography>
                  <QuestionHelper
                    text="Ladder Boxes contain random amount of Ladder tokens and can be earned by interacting with our protocol."
                    style={{ background: 'transparent' }}
                  />
                </Typography>
                <Typography fontSize={26} fontWeight={400}>
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
                  <Typography fontSize={18} fontWeight={500}>
                    YOUR LUCK
                  </Typography>
                  <QuestionHelper
                    text="Luck determines the quality of your rewards from Ladder Boxes! By increasing your luck parameter, you enhance your chances of receiving more valuable rewards in the box."
                    style={{ background: 'transparent' }}
                  />
                </Typography>
                <Typography fontSize={26} fontWeight={400} mb={15}>
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
      {/* <Mua /> */}
      {/* <Box>
        <ActivityBox refreshCb={refreshCb} />
      </Box> */}
      <Box id="box" ref={boxSection}>
        <TaskListBox boxData={boxData} claimBox={handleClaimBox} />
      </Box>
      <Box id="luck" ref={luckSection}>
        <TaskListLuck lucksData={lucksData} claimBox={handleClaimLuck} />{' '}
      </Box>
      <QuestionList />
    </StyledWrapper>
  )
}
