import { ChainId } from '@ladder/sdk'
import { TYPE, TaskCards, TaskListData } from './TaskList'
import { useActivityList } from 'hooks/useAirdrop'
import { useMemo } from 'react'
import useModal from 'hooks/useModal'
import BoxModal, { IncompleteModal } from './AirdropModal'
import { ReactComponent as Badges } from 'assets/svg/airdrop/badges.svg'
import { Box, Typography } from '@mui/material'

export enum ActivityProps {
  MintNow = 'mint-now',
  Mint = 'mint',
  GoToGalxe = 'goto-galxe'
}

const tasks = [
  {
    title: 'Mint SophiaVerse Awakening NFT (free)',
    chain: ChainId.MATIC,
    icon: <Badges />,
    tooltip: 'You will be redirected to SophiaVerse minting page (chose BSC).',
    id: ActivityProps.MintNow,
    buttonText: 'Mint Now',
    route: 'https://www.sophiaverse.ai/#pre-order'
  },
  {
    title: 'Obtain level 1 badge',
    chain: ChainId.MATIC,
    icon: <Badges />,
    tooltip: 'Get at least one 1st lvl badge on Ladder Testnet 3.',
    route: 'round3',
    id: ActivityProps.Mint
  },
  {
    title: 'Complete Quest to Join in the Raffles → Galxe',
    chain: ChainId.MATIC,
    icon: <Badges />,
    tooltip: 'You will be redirected to Galxe page.',
    route: 'https://galxe.com/ladder/campaign/GCpC6ttemH',
    id: ActivityProps.GoToGalxe,
    buttonText: 'Go to Galxe'
  }
]

export default function ActivityBox({ refreshCb }: { refreshCb: () => void }) {
  const { getBox, taskState: state } = useActivityList(refreshCb)
  const { showModal } = useModal()

  const sorted: TaskListData = useMemo(
    () =>
      tasks.reduce(
        (acc, item) => {
          const itemState = state?.[item.id]
          if (itemState) {
            if (itemState.claimed === true) {
              acc.completed.push({ ...item, completed: itemState.finished, claimed: itemState.claimed })
              return acc
            } else {
              acc.canBeDone.push({
                ...item,
                completed: itemState.finished,
                claimed: itemState.claimed,
                action: () => {
                  itemState.finished
                    ? showModal(
                        <BoxModal
                          getBox={getBox({ boxType: itemState.boxType, boxs: itemState.boxs })}
                          BoxId={item.id}
                        />
                      )
                    : showModal(<IncompleteModal route={item.route} />)
                }
              })
              return acc
            }
          } else {
            acc.canBeDone.push({ ...item, completed: false, claimed: false })
            return acc
          }
        },
        { canBeDone: [], completed: [], cannotComplete: [] } as TaskListData
      ),
    [getBox, showModal, state]
  )
  return (
    <>
      <Box
        maxWidth={'1440px'}
        width={'100%'}
        margin="0 auto"
        display="flex"
        flexDirection={'column'}
        alignItems={'center'}
        gap={20}
        padding={24}
        // overflow="hidden"
      >
        <Typography variant="h5" textAlign={'center'}>
          {'SophiaVerse Awakening'}
        </Typography>
        <Typography whiteSpace={'break-spaces'} maxWidth={700} textAlign={'center'}>
          Campaign duration: December 21, 2023 - December 28, 2023 | Winners drawn: December 29, 2023{' '}
        </Typography>
        <Typography whiteSpace={'break-spaces'} maxWidth={800} textAlign={'center'}>
          Ladder enters SophiaVerse in search for Artificial general intelligence. Mint SophiaVerse Tier 1 Awakening NFT
          for free, then earn at least 1 Ladder badge to enter the raffle for 500 USDT + 1.5 ETH worth NFTs: 5
          Consciousness NFTs and 2 Singularity NFTs. Once you’ve done both tasks, finish the quest to enter the raffle.{' '}
        </Typography>
        <TaskCards type={TYPE.activity} key={1} data={sorted?.canBeDone ?? []} />,
      </Box>
    </>
  )
}
