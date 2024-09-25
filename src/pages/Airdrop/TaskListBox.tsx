import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE } from './TaskList'
import { useMemo } from 'react'
import { ReactComponent as Badges } from 'assets/svg/airdrop/badges.svg'
import { BoxData } from './index'

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
