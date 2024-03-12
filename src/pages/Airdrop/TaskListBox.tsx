import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE, TaskListData } from './TaskList'
import { useBoxTasks } from 'hooks/useAirdrop'
import { useMemo } from 'react'
import useModal from 'hooks/useModal'
import BoxModal, { IncompleteModal } from './AirdropModal'
import { ReactComponent as Tester } from 'assets/svg/airdrop/tester.svg'
import { ReactComponent as Monopoly } from 'assets/svg/airdrop/monopoly.svg'
import { ReactComponent as Badges } from 'assets/svg/airdrop/badges.svg'
import { ReactComponent as Trading } from 'assets/svg/airdrop/trading.svg'

const expiredList = ['test1', 'test2', 'monopoly']

const tasks = [
  // {
  //   title: ' Make a swap in “AI Meets Bitcoin” Liquidity Pool',
  //   chain: ChainId.MAINNET,
  //   id: 'swapAIBtc',
  //   icon: <Tester />
  // },
  {
    title: 'Participate in testnet 1',
    chain: ChainId.SEPOLIA,
    id: 'test1',
    icon: <Tester />
  },
  {
    title: 'Participate in testnet 2',
    chain: ChainId.SEPOLIA,
    id: 'test2',
    icon: <Tester />
  },
  {
    title: 'Participate in Monopoly Campaign',
    chain: ChainId.SEPOLIA,
    id: 'monopoly',
    icon: <Monopoly />
  },
  {
    title: 'Obtain a level 1 badge (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'test3',
    icon: <Badges />,
    route: 'round3'
  },
  {
    title: 'Obtain all level 1 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-1',
    icon: <Badges />,
    route: 'round3'
  },
  {
    title: 'Obtain all level 2 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-2',
    icon: <Badges />,
    route: 'round3'
  },
  {
    title: 'Obtain all level 3 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-3',
    icon: <Badges />,
    route: 'round3'
  },
  // {
  //   title: 'Buy at least 1 DWD-SFT',
  //   id: 'dogewalkSwap',
  //   chain: ChainId.BSC,
  //   link: 'http://dogewalk.ladder.top/',
  //   icon: <Trading />
  // },
  // {
  //   title: 'Hold at least 4 DWD-SFT',
  //   id: 'dogewalkHold',
  //   chain: ChainId.BSC,
  //   link: 'http://dogewalk.ladder.top/',
  //   icon: <Trading />,
  //   tooltip:
  //     'A snapshot will be taken on a random date. All wallets with more than 4 DW SFTs will qualify for the reward.						'
  // },
  // {
  //   title: 'Provide LP for LOK/ MATIC pool to earn Ladder Box',
  //   id: 'lockLP',
  //   chain: ChainId.MATIC,
  //   link: 'https://lok.ladder.top',
  //   icon: <Trading />
  // },
  {
    title: 'Make 2 swaps to Earn Ladder Box => Swap at least 2 WolfPack Pups NFTs',
    id: 'swap-two',
    chain: ChainId.MATIC,
    link: 'https://wolfpack.ladder.top/swap',
    icon: <Trading />
  },
  {
    title: 'Hold at least 2 WolfPack Pups NFTs to Earn Ladder Box => Hold at least 2 WolfPack Pups NFTs',
    id: 'hold-two',
    chain: ChainId.MATIC,
    link: 'https://wolfpack.ladder.top/swap',
    icon: <Trading />
  }
]

export default function TaskListLuck({ refreshCb }: { refreshCb: () => void }) {
  const { getBox, taskState: state } = useBoxTasks(refreshCb)
  // console.log('🚀 ~ file: TaskListBox.tsx:100 ~ TaskListLuck ~ state:', state)
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
              if (expiredList.includes(item.id) && !itemState.finished) {
                acc.cannotComplete.push({
                  ...item,
                  completed: itemState.finished,
                  claimed: itemState.claimed,
                  expired: true
                })
                return acc
              }
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
                    : showModal(<IncompleteModal route={item.route} link={item.link} />)
                }
              })
              return acc
            }
          } else {
            if (expiredList.includes(item.id)) {
              acc.cannotComplete.push({ ...item, completed: false, claimed: false, expired: true })
              return acc
            }
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
      <TaskList type={TYPE.box} data={sorted} />
    </>
  )
}
