import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE } from './TaskList'
import { useMemo } from 'react'
import { ReactComponent as Tester } from 'assets/svg/airdrop/tester.svg'
import { ReactComponent as Monopoly } from 'assets/svg/airdrop/monopoly.svg'
import { ReactComponent as Badges } from 'assets/svg/airdrop/badges.svg'
import { BoxData } from './index'

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
  }
]

export interface LuckItem {
  taskId: string
  description: string
  rewardBox: number
  rewardLuck: number
  expireTime: string
}
interface TaskListLuckProps {
  boxData: BoxData
  claimBox: (item: LuckItem) => void
}

export default function TaskListLuck({ boxData, claimBox }: TaskListLuckProps) {
  const taskListData = useMemo(() => {
    const mapTask = (item: LuckItem, completed: boolean, claimed: boolean, expired = false, scrollTo?: string) => {
      const baseObj = {
        ...item,
        title: item.description,
        id: item.taskId,
        chain: ChainId.SEPOLIA,
        icon: <Badges />,
        route: 'round3',
        completed,
        claimed,
        expired,
        scrollTo
      }
      return {
        ...baseObj,
        action: () => claimBox(baseObj)
      }
    }

    return {
      canBeDone: boxData?.toClaim ? boxData.toClaim.map(item => mapTask(item, false, false, false, 'badge')) : [],
      completed: boxData?.claimed ? boxData.claimed.map(item => mapTask(item, true, true)) : [],
      cannotComplete: boxData?.expired ? boxData.expired.map(item => mapTask(item, false, false, true)) : []
    }
  }, [boxData, claimBox])
  return (
    <>
      <TaskList type={TYPE.box} data={taskListData} />
    </>
  )
}
