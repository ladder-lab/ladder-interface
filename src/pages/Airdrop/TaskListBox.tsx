import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE, TaskListData } from './TaskList'
import { useBoxTasks } from 'hooks/useAirdrop'
import { useMemo } from 'react'
import useModal from 'hooks/useModal'
import BoxModal, { IncompleteModal } from './AirdropModal'
import { ReactComponent as Tester } from 'assets/svg/airdrop/tester.svg'
import { ReactComponent as Monopoly } from 'assets/svg/airdrop/monopoly.svg'
import { ReactComponent as Badges } from 'assets/svg/airdrop/badges.svg'

const expiredList = ['test1', 'test2', 'monopoly']

const tasks = [
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
    icon: <Badges />
  },
  {
    title: 'Obtain all level 1 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-1',
    icon: <Badges />
  },
  {
    title: 'Obtain all level 2 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-2',
    icon: <Badges />
  },
  {
    title: 'Obtain all level 3 badges (Testnet 3)',
    chain: ChainId.SEPOLIA,
    id: 'all-Level-3',
    icon: <Badges />
  }
]

export default function TaskListLuck({ refreshCb }: { refreshCb: () => void }) {
  const { getBox, taskState: state } = useBoxTasks(refreshCb)
  const { showModal } = useModal()
  const sorted: TaskListData = useMemo(
    () =>
      tasks.reduce(
        (acc, item) => {
          const itemState = state?.[item.id]
          if (itemState) {
            if (itemState.claimed === true) {
              acc.completed.push({ ...item, completed: itemState.completed, claimed: itemState.claimed })
              return acc
            } else {
              if (expiredList.includes(item.id) && !itemState.complete) {
                acc.cannotComplete.push({
                  ...item,
                  completed: itemState.complete,
                  claimed: itemState.claimed,
                  expired: true
                })
                return acc
              }
              acc.canBeDone.push({
                ...item,
                completed: itemState.complete,
                claimed: itemState.claimed,
                action: () => {
                  itemState.complete
                    ? showModal(<BoxModal getBox={getBox({ boxType: itemState.boxType, boxs: itemState.boxs })} />)
                    : showModal(<IncompleteModal />)
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
