import { Box, Typography } from '@mui/material'
import { ReactComponent as MuaLadder } from 'assets/svg/airdrop/mua.svg'
import { ReactComponent as Badge1 } from 'assets/svg/airdrop/badge1.svg'
import { ReactComponent as Badge1Color } from 'assets/svg/airdrop/badge1-color.svg'
import { ReactComponent as Polygon } from 'assets/svg/airdrop/polygon.svg'
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

const disabledBtn = false

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
        Ladder Task Time: Oct 11, 2023 - Oct 25, 2023 at Ladder | MUA Raffle Time: Oct 24, 2023 - Oct 25, 2023 at MUA
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
            background: isDarkMode ? '#99F7F4' : '#99F7F4',
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
          onClick={() => {
            !disabledBtn && window.open('https://app.questn.com/quest/825937186727813605', '_blank')
          }}
        >
          Complete the Quest
          <QuestionHelper
            text="Earn extra by completing mini-tasks at QuestN"
            style={{ background: 'transparent', color: isDarkMode ? '#555555' : undefined }}
          />
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} mb={20}>
        <TaskCards
          sx={{
            gridTemplateColumns: { xs: '100%', md: '332px 332px 332px' }
          }}
          type={TYPE.swap}
          data={[
            {
              title: 'PFPDAO NFT SWAP',
              chain: ChainId.SEPOLIA,
              completed: false,
              id: 'fansiNft',
              count: taskState.nftSwapCount,
              action: () => {
                window.open('https://pfpdao.ladder.top', '_blank')
              },
              chainTag: (
                <>
                  <Polygon />
                  <span>Polygon</span>
                </>
              ),
              icon: (
                <svg
                  id="Layer_2"
                  width={40}
                  height={40}
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 402.33 357.58"
                >
                  <g id="_图层_1" data-name="图层 1">
                    <g>
                      <path d="M93.69,244.61h46.49c1.25,0,2.27-1.02,2.27-2.27v-4.75c0-1.25-1.02-2.27-2.27-2.27h-63.67c-7.52,0-13.62,6.1-13.62,13.62v41.65c0,1.25,1.02,2.27,2.27,2.27h23.98c1.25,0,2.27-1.02,2.27-2.27v-19.58c0-1.25,1.02-2.27,2.27-2.27h46.49c1.25,0,2.27-1.02,2.27-2.27v-4.75c0-1.25-1.02-2.27-2.27-2.27h-46.49c-1.25,0-2.27-1.02-2.27-2.27v-10.29c0-1.25,1.02-2.27,2.27-2.27Z" />
                      <path d="M397.78,247.06l-34.32-59.46c-6.08-10.54-17.32-17.03-29.49-17.03H166.13l6.34,10.96c1.96,3.38,5.57,5.47,9.47,5.47h152.04c6.27,0,12.12,3.38,15.27,8.8l34.32,59.46c3.15,5.44,3.15,12.2,0,17.63l-34.32,59.46c-3.15,5.44-9,8.82-15.27,8.82h-68.65c-6.29,0-12.14-3.38-15.27-8.82l-34.67-60.06-6.33,10.95c-1.96,3.39-1.96,7.56,0,10.95l26.78,46.36c6.06,10.5,17.37,17.03,29.5,17.03h68.65c12.12,0,23.42-6.53,29.48-17.03l34.32-59.44c6.06-10.5,6.06-23.55,0-34.05Z" />
                      <path d="M186.96,255.88l6.32-10.96c1.95-3.39,1.95-7.56,0-10.94L117.25,102.32c-3.15-5.44-3.15-12.2,0-17.64l34.32-59.44c3.15-5.44,9-8.82,15.27-8.82h68.65c6.27,0,12.12,3.38,15.27,8.82l34.32,59.44c3.15,5.44,3.15,12.2,0,17.64l-34.69,60.06h12.66c3.91,0,7.52-2.09,9.48-5.47l26.78-46.38c6.06-10.5,6.06-23.55,0-34.05l-34.32-59.44c-6.06-10.5-17.37-17.03-29.5-17.03h-68.65c-12.12,0-23.44,6.52-29.5,17.01l-34.32,59.46c-6.06,10.5-6.06,23.55,0,34.05l83.94,145.36Z" />
                      <path d="M250.41,195.21h-12.66c-3.91,0-7.52,2.09-9.48,5.47l-76.01,131.67c-3.13,5.44-8.98,8.82-15.27,8.82H68.35c-6.27,0-12.12-3.38-15.27-8.82l-34.32-59.46c-3.15-5.42-3.15-12.18,0-17.63l34.32-59.46c3.15-5.42,9-8.8,15.27-8.8h69.36l-6.34-10.96c-1.96-3.38-5.57-5.47-9.47-5.47h-53.55c-12.16,0-23.39,6.49-29.47,17.02L4.55,247.06c-6.06,10.5-6.06,23.55,0,34.03l34.32,59.46c6.06,10.5,17.35,17.03,29.48,17.03h68.65c12.12,0,23.44-6.53,29.5-17.03l83.92-145.35Z" />
                      <path d="M224.53,64.73h-54.78c-7.52,0-13.62,6.1-13.62,13.62v41.65c0,1.25,1.02,2.27,2.27,2.27h23.98c1.25,0,2.27-1.02,2.27-2.27v-10.98c0-1.25,1.01-2.26,2.26-2.26h39.39c11.52,0,19.49-8.75,19.87-20.15,.41-12.03-9.61-21.88-21.65-21.88Zm-17.95,32.73h-19.67c-1.25,0-2.26-1.01-2.26-2.26v-18.92c0-1.25,1.01-2.26,2.26-2.26h18.68c6.67,0,12.26,5.46,12.08,12.12-.18,6.39-4.63,11.32-11.09,11.32Z" />
                      <path d="M323.02,235.31h-54.78c-7.52,0-13.62,6.1-13.62,13.62v41.65c0,1.25,1.02,2.27,2.27,2.27h23.98c1.25,0,2.27-1.02,2.27-2.27v-10.98c0-1.25,1.01-2.26,2.26-2.26h39.39c11.52,0,19.49-8.75,19.87-20.15,.41-12.03-9.61-21.88-21.65-21.88Zm-17.95,32.73h-19.67c-1.25,0-2.26-1.01-2.26-2.26v-18.92c0-1.25,1.01-2.26,2.26-2.26h18.68c6.67,0,12.26,5.46,12.08,12.12-.18,6.39-4.63,11.32-11.09,11.32Z" />
                    </g>
                  </g>
                </svg>
              ),
              desc: (
                <>
                  Earn 500 MUA points on each Swap.
                  <br />
                  (Max 5000 pt)
                </>
              ),
              // route?: string
              tooltip:
                'PFP-DAO users can instantly swap (buy/sell) Equipment NFTs, which are used to level up PFP-DAO characters, thus increasing their rewards proportionally.'
            },
            {
              title: 'DogeWalk SFT Swap',
              chain: ChainId.SEPOLIA,
              completed: false,
              id: 'fansiNft',
              action: () => {
                window.open('https://dogewalk.ladder.top/swap', '_blank')
              },
              icon: <Dogewalk />,
              count: taskState.sftSwapCount,
              desc: (
                <>
                  Earn 500 MUA points on each Swap.
                  <br />
                  (Max 5000 pt)
                </>
              ),
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
