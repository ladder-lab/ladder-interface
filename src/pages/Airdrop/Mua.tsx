import { Box, Typography } from '@mui/material'
import { ReactComponent as MuaLadder } from 'assets/svg/airdrop/mua.svg'
import { ReactComponent as Badge1 } from 'assets/svg/airdrop/badge1.svg'
import { ReactComponent as Badge1Color } from 'assets/svg/airdrop/badge1-color.svg'
// import { ReactComponent as Polygon } from 'assets/svg/airdrop/polygon.svg'
import { ReactComponent as Bnb } from 'assets/svg/airdrop/bnb.svg'
import { ReactComponent as Dogewalk } from 'assets/svg/airdrop/dogewalk.svg'
import { ReactComponent as Ladder } from 'assets/svg/airdrop/ladder.svg'
import QuestionHelper from 'components/essential/QuestionHelper'
import { TYPE, TaskCards } from './TaskList'
import { ChainId } from '@ladder/sdk'
import { useMuaTasks } from 'hooks/useAirdrop'
import { useIsDarkMode } from 'state/user/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const disabledBtn = true

export default function Mua() {
  const { taskState } = useMuaTasks()
  const isDarkMode = useIsDarkMode()
  const navigate = useNavigate()
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
      <Typography fontSize={31} fontWeight={800} textAlign={'center'}>
        MUA Boarding Odyssey: Season Two - Ladder
      </Typography>
      <Typography textAlign={'center'} fontSize={14}>
        Ladder Task Time: Oct 11th 2023 - Oct 25, 2023 at Ladder | Mua Raffle Time: Oct 124, 2023 - Oct 25, 2023 at MUA
      </Typography>
      <Typography maxWidth={600} textAlign={'center'}>
        Ladder is joining the MUAverse and onboarding the Odyssey Season Two. Complete the following Ladder tasks, earn
        MUA points, and get to raffle and split for{' '}
        <Typography component={'span'} fontWeight={700}>
          1,500 USDT.
        </Typography>
      </Typography>
      <Box display={'flex'} alignItems={'center'} gap={40}>
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
          my={20}
          onClick={() => {
            !disabledBtn && window.open('https://muaverse.build/boarding', '_blank')
          }}
        >
          To MUA
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
          To QuestN
          <QuestionHelper
            text="Earn extra by completing mini-tasks at QuestN"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} mb={20}>
        <TaskCards
          sx={{
            gridTemplateColumns: { xs: '100%', md: '332px 332px' }
          }}
          type={TYPE.swap}
          data={[
            // {
            //   title: 'Fansi NFT Swap',
            //   chain: ChainId.SEPOLIA,
            //   completed: false,
            //   id: 'fansiNft',
            //   count: taskState.nftSwapCount,
            //   action: () => {
            //     window.open('https://ladder-wolfpack.netlify.app/', '_blank')
            //   },
            //   chainTag: (
            //     <>
            //       <Polygon />
            //       <span>Polygon</span>
            //     </>
            //   ),
            //   icon: (
            //     <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            //       <circle opacity="0.2" cx="20" cy="20.4395" r="20" fill="#7D74FF" />
            //     </svg>
            //   ),

            //   desc: 'Earn 500 MUA points on each Swap. (Max 5000 pt)'
            //   // route?: string
            //   // tooltip?: string
            // },
            {
              title: 'DogeWalk SFT Swap',
              chain: ChainId.SEPOLIA,
              completed: false,
              id: 'fansiNft',
              action: () => {
                window.open('https://ladder-dogewalk3.netlify.app/swap', '_blank')
              },
              icon: <Dogewalk />,
              count: taskState.sftSwapCount,
              desc: 'Earn 500 MUA points on each Swap. (Max 5000 pt)',
              chainTag: (
                <>
                  <Bnb />
                  <span>BNB Chain</span>
                </>
              ),
              // route?: string
              tooltip: `Dogewalk is THE Web3 community for dog lovers, combining a gamified move-to-earn (M2E) model with real-life token utility via e-commerce.

              SFT = semi-fungible token, combining the divisibility of ERC-20 fungible tokens and the metadata properties of ERC-721 NFTs.
              Dogewalk SFTs act as token vouchers.`
            },
            {
              title: 'Obtain a level 1 badge (Testnet 3)',
              chain: ChainId.SEPOLIA,
              completed: taskState.task3,
              desc: ' Earn 500 MUA points.',
              id: 'badge',
              action: () => {
                navigate(routes.testnet)
              },
              plus1Icon: !!taskState.task3 ? <Badge1Color /> : <Badge1 style={{ opacity: isDarkMode ? 0.6 : 1 }} />,
              chainTag: 'Sepolia',
              icon: <Ladder />,
              // route?: string
              tooltip:
                'Visit https://test.ladder.top/round3, claim your free Testnet assets (Sepolia) and trade your way to the first Ladder Badge.'
            }
          ]}
        />
      </Box>
      <MuaLadder />
    </Box>
  )
}
