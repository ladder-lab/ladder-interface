import { Box, Typography } from '@mui/material'
import { ReactComponent as MuaLadder } from 'assets/svg/airdrop/mua.svg'
import { ReactComponent as Badge1 } from 'assets/svg/airdrop/badge1.svg'
import { ReactComponent as Polygon } from 'assets/svg/airdrop/polygon.svg'
import { ReactComponent as Bnb } from 'assets/svg/airdrop/bnb.svg'
import { ReactComponent as Dogewalk } from 'assets/svg/airdrop/dogewalk.svg'
import { ReactComponent as Ladder } from 'assets/svg/airdrop/ladder.svg'
import QuestionHelper from 'components/essential/QuestionHelper'
import { TYPE, TaskCards } from './TaskList'
import { ChainId } from '@ladder/sdk'

export default function Mua() {
  return (
    <Box
      sx={{
        background: '#ffffff40',
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
        Ladder Task Time: Oct 9th 2023 - Oct 20, 2023 at Ladder ｜ Mua Raffle Time: Oct 19, 2023 - Oct 20, 2023 at MUA
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
          sx={{ padding: '6px 24px', background: '#ffffff70', borderRadius: 6, fontWeight: 500 }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
          my={20}
        >
          To MUA
          <QuestionHelper text="Check out how many points you earn at MUA" style={{ background: 'transparent' }} />
        </Box>
        <Box
          sx={{ padding: '6px 24px', background: '#ffffff70', borderRadius: 6, fontWeight: 500 }}
          display={'flex'}
          alignItems={'center'}
          gap={5}
        >
          To QuestN
          <QuestionHelper text="Earn extra by completing mini-tasks at QuestN" style={{ background: 'transparent' }} />
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
              title: 'Fansi NFT Swap',
              chain: ChainId.SEPOLIA,
              completed: false,
              id: 'fansiNft',
              action: () => {},
              chainTag: (
                <>
                  <Polygon />
                  <span>Polygon</span>
                </>
              ),
              icon: (
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle opacity="0.2" cx="20" cy="20.4395" r="20" fill="#7D74FF" />
                </svg>
              ),

              desc: 'Earn 500 MUA points on each Swap. (Max 5000 pt)'
              // route?: string
              // tooltip?: string
            },
            {
              title: 'DogeWalk SFT Swap',
              chain: ChainId.SEPOLIA,
              completed: false,
              id: 'fansiNft',
              action: () => {},
              icon: <Dogewalk />,
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
              completed: false,
              id: 'fansiNft',
              action: () => {},
              plus1Icon: <Badge1 />,
              chainTag: 'Testnet 3',
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
