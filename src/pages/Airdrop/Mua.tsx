import { Box, Typography } from '@mui/material'
import { ReactComponent as MuaLadder } from 'assets/svg/airdrop/mua.svg'
// import { ReactComponent as Badge1 } from 'assets/svg/airdrop/badge1.svg'
// import { ReactComponent as Badge1Color } from 'assets/svg/airdrop/badge1-color.svg'
import { ReactComponent as Polygon } from 'assets/svg/airdrop/polygon.svg'
import { ReactComponent as Bnb } from 'assets/svg/airdrop/bnb.svg'
import { ReactComponent as Dogewalk } from 'assets/svg/airdrop/dogewalk.svg'
import { ReactComponent as Ladder } from 'assets/svg/airdrop/ladder.svg'
import Drago from 'assets/images/Airdrop/dragoLogo.jpg'
// import Genso from 'assets/images/Airdrop/gensoLogo.png'
import Lok from 'assets/images/Airdrop/lokLogo.jpg'
import QuestionHelper from 'components/essential/QuestionHelper'
import { TYPE, CardProp, MuaSeasonTowTaskCards } from './TaskList'
import { ChainId } from '@ladder/sdk'
import { useMemo } from 'react'
import { useMuaSeasonTwoTasks } from 'hooks/useAirdrop'
import { useIsDarkMode } from 'state/user/hooks'
// import { useNavigate } from 'react-router-dom'
// import { routes } from 'constants/routes'
import useModal from 'hooks/useModal'
import BoxModal, { IncompleteModal } from './AirdropModal'

const disabledBtn = false

const tasks = [
  {
    id: 'gensoSwap',
    boxType: 14,
    boxs: 0,
    claimed: false,
    finished: false,
    title: 'Genso Beginner Equipment Swap',
    chain: ChainId.SEPOLIA,
    completed: false,
    action: () => {},
    link: 'https://mua-campaign.ladder.top/swap',
    route: '',
    // icon: <Genso />,
    iconUrl: Drago,
    count: 0,
    desc: (
      <>
        Earn 500 MUA points on each Swap.
        <br />
        (max 5000 points)
      </>
    ),
    chainTag: (
      <>
        <Polygon />
        <span>Polygon</span>
      </>
    ),
    // route?: string
    tooltip: `Genso Beginner Equipment is designed to give a starting boost for new players that venture into Genso’s fantasy MMO world.`
  },
  {
    id: 'lokSwap',
    boxType: 13,
    boxs: 0,
    claimed: false,
    finished: false,
    title: 'League of Kingdoms Drago Swap',
    chain: ChainId.SEPOLIA,
    completed: false,
    action: () => {},
    link: 'https://mua-campaign.ladder.top/swap',
    route: '',
    // icon: <Drago />,
    iconUrl: Lok,
    count: 0,
    desc: (
      <>
        Earn 500 MUA points on each Swap.
        <br />
        (max 1500 points)
      </>
    ),
    chainTag: (
      <>
        <Polygon />
        <span>Polygon</span>
      </>
    ),
    tooltip:
      'Dragos are dragon-like creatures that inhabit League of Kingdom’s MMO world, aiding players in their conquests.'
  }
  // {
  //   id: 'boxTask15',
  //   boxType: 15,
  //   boxs: 0,
  //   claimed: false,
  //   finished: false,
  //   title: 'Obtain a level 1 badge (Testnet 3)',
  //   chain: ChainId.SEPOLIA,
  //   completed: false,
  //   desc: ' Earn 500 MUA points.',
  //   action: () => {},
  //   link: 'https://pfpdao.ladder.top',
  //   route: '',
  //   chainTag: 'Sepolia',
  //   icon: <Ladder />,
  //   // route?: string
  //   tooltip:
  //     'Visit https://test.ladder.top/round3, claim your free Testnet assets (Sepolia) and trade your way to the first Ladder Badge.'
  // }
]
export default function Mua() {
  // const { taskState } = useMuaTasks()
  const { getBox, taskState: seasonTwoTaskState } = useMuaSeasonTwoTasks()
  const isDarkMode = useIsDarkMode()
  // const navigate = useNavigate()
  const { showModal } = useModal()

  const sorted: Array<CardProp> = useMemo(
    () =>
      tasks.reduce((acc, item) => {
        const itemState = seasonTwoTaskState?.[item.id]
        if (itemState) {
          // item.boxType = itemState.boxType
          item.count = itemState.boxs
          item.claimed = itemState.claimed
          item.completed = itemState.finished
          item.action = () => {
            itemState.finished
              ? showModal(
                  <BoxModal getBox={getBox({ boxType: itemState.boxType, boxs: itemState.boxs })} BoxId={item.id} />
                )
              : showModal(<IncompleteModal route={item.route} link={item.link} />)
          }
        }
        acc.push(item as CardProp)
        return acc
      }, [] as Array<CardProp>),
    [getBox, seasonTwoTaskState, showModal]
  )

  return (
    <Box
      sx={{
        background: isDarkMode ? '#ffffff20' : '#ffffff40',
        width: '100%',
        display: 'grid',
        justifyItems: 'center',
        gap: 20,
        padding: '46px 24px'
      }}
    >
      <Typography fontSize={32} fontWeight={700} textAlign={'center'}>
        MUA Boarding Odyssey Season 6: Ladder x Genso
      </Typography>
      <Typography textAlign={'center'} fontSize={14}>
        Ladder Task Time: Mar. 27, 2024 - Apr. 9, 2024 at Ladder | MUA Raffle Time: Apr. 9, 2024 - Apr. 11 2024 at MUA
      </Typography>
      <Typography maxWidth={600} lineHeight={'22px'} textAlign={'center'}>
        Ladder is returning to MUAverse for their Boarding Odyssey Season 6. Complete the following Ladder task, earn
        MUA points, and enter the raffle for a total prize pool of{' '}
        <Typography component={'span'} fontWeight={700}>
          1,500 USDT.
        </Typography>
      </Typography>
      <Box display={'flex'} alignItems={'center'} gap={40}>
        {/* <Box
          sx={{
            cursor: disabledBtn ? 'not-allowed' : 'pointer',
            opacity: disabledBtn ? 0.6 : 1,
            padding: '6px 24px',
            background: isDarkMode
              ? 'linear-gradient(90deg, #FFB3F3 0%, #D7C6FF 106.67%)'
              : 'linear-gradient(90deg, #FFB3F3 0%, #D7C6FF 106.67%)',
            color: '#333',
            borderRadius: 6,
            fontWeight: 500,
            border: '1px solid transparent',
            '&:hover': {
              border: '1px solid #FFB3F3'
            }
          }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          my={20}
          onClick={() => {
            !disabledBtn && window.open('https://muaverse.build/boarding', '_blank')
          }}
        >
          Mint MUA Pass First
          <QuestionHelper
            text="Check out how many points you earn at MUA"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box>
        <Box
          sx={{
            cursor: disabledBtn ? 'not-allowed' : 'pointer',
            opacity: disabledBtn ? 0.6 : 1,
            padding: '6px 24px',
            background: isDarkMode ? '#ffffff50' : '#ffffff70',
            borderRadius: 6,
            fontWeight: 500,
            border: '1px solid transparent',
            '&:hover': {
              border: '1px solid #FFB3F3'
            }
          }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          onClick={() => {
            !disabledBtn && window.open('https://app.questn.com/quest/825937186727813605', '_blank')
          }}
        >
          Complete MUA Quest
          <QuestionHelper
            text="Earn extra by completing mini-tasks at QuestN"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box>
        <Box
          sx={{
            cursor: disabledBtn ? 'not-allowed' : 'pointer',
            opacity: disabledBtn ? 0.6 : 1,
            padding: '6px 24px',
            background: isDarkMode ? '#ffffff50' : '#ffffff70',
            borderRadius: 6,
            fontWeight: 500,
            border: '1px solid transparent',
            '&:hover': {
              border: '1px solid #FFB3F3'
            }
          }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          onClick={() => {
            !disabledBtn && window.open('https://app.questn.com/quest/827279623466156047', '_blank')
          }}
        >
          Complete PFP DAO Quest
          <QuestionHelper
            text="Earn extra by completing mini-tasks at QuestN"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box> */}
        <Box
          sx={{
            cursor: disabledBtn ? 'not-allowed' : 'pointer',
            opacity: disabledBtn ? 0.6 : 1,
            padding: '6px 24px',
            background: isDarkMode ? '#ffffff50' : '#1F9898',
            borderRadius: 6,
            fontWeight: 400,
            border: '1px solid transparent',
            '&:hover': {
              border: '1px solid #FFB3F3'
            }
          }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          onClick={() => {
            !disabledBtn && window.open('https://muaverse.build/boarding', '_blank')
          }}
        >
          Mint MUA Pass first
          <QuestionHelper
            text="Freemint your MUA Boarding Pass to be eligible for MUA points"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : '#333333' }}
          />
        </Box>
        <Box
          sx={{
            cursor: disabledBtn ? 'not-allowed' : 'pointer',
            opacity: disabledBtn ? 0.6 : 1,
            padding: '6px 24px',
            background: isDarkMode ? '#ffffff50' : '#ffffff70',
            borderRadius: 6,
            fontWeight: 400,
            border: '1px solid transparent',
            '&:hover': {
              border: '1px solid #FFB3F3'
            }
          }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          onClick={() => {
            !disabledBtn && window.open('https://app.questn.com/quest/886244190475755865', '_blank')
          }}
        >
          Complete the Quest(N)
          <QuestionHelper
            text="Earn additional prizes and MUA points on QuestN"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} mb={20}>
        <MuaSeasonTowTaskCards
          sx={{
            gridTemplateColumns: { xs: '100%', md: '332px 332px' }
          }}
          type={TYPE.swap}
          data={sorted}
        />
      </Box>
      <Box
        sx={{
          svg: {
            width: '100%'
          }
        }}
      >
        <MuaLadder />
      </Box>
    </Box>
  )
}
