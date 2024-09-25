import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE } from './TaskList'
import { useMemo } from 'react'
import { ReactComponent as Social } from 'assets/svg/airdrop/social.svg'
import { useSignLogin } from 'hooks/useSignIn'
import { BoxData } from './index'
import { LuckItem } from './TaskListBox'

interface TaskListLuckProps {
  lucksData: BoxData
  claimBox: (item: LuckItem) => void
}

export default function TaskListLuck({ lucksData, claimBox }: TaskListLuckProps) {
  const { token, sign } = useSignLogin()
  const taskListData = useMemo(() => {
    return {
      canBeDone: lucksData?.toClaim
        ? lucksData.toClaim.map(item => {
            const baseObj = {
              ...item,
              title: item.description,
              id: item.taskId,
              chain: ChainId.SEPOLIA,
              icon: <Social />,
              route: 'round3'
            }
            return {
              ...baseObj,
              completed: false,
              claimed: false,
              expired: false,
              scrollTo: 'claimOauth',
              statusText: !token ? 'Sign' : 'Boost',
              action: () => {
                !token ? sign() : claimBox(baseObj)
              }
            }
          })
        : [],
      completed: lucksData?.claimed
        ? lucksData.claimed.map(item => {
            const baseObj = {
              ...item,
              title: item.description,
              id: item.taskId,
              chain: ChainId.SEPOLIA,
              icon: <Social />,
              route: 'round3'
            }
            return {
              ...baseObj,
              completed: true,
              claimed: true,
              expired: false
            }
          })
        : [],
      cannotComplete: lucksData?.expired
        ? lucksData.expired.map(item => {
            const baseObj = {
              ...item,
              title: item.description,
              id: item.taskId,
              chain: ChainId.SEPOLIA,
              icon: <Social />,
              route: 'round3'
            }
            return {
              ...baseObj,
              completed: false,
              claimed: false,
              expired: true
            }
          })
        : []
    }
  }, [lucksData, claimBox, token])

  return <TaskList type={TYPE.luck} data={taskListData} />
}
