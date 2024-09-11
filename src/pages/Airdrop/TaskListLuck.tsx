import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE, TaskListData } from './TaskList'
import { useMemo } from 'react'
import { ReactComponent as Monopoly } from 'assets/svg/airdrop/monopoly.svg'
import { ReactComponent as Social } from 'assets/svg/airdrop/social.svg'
import { ReactComponent as Sbt } from 'assets/svg/airdrop/sbt.svg'
import { useVerifyTwitter } from 'hooks/useVerifyTwitter'
import { useSignLogin } from 'hooks/useSignIn'
import { BoxData } from './index'
import { LuckItem } from './TaskListBox'

const expiredList = ['monopolyRank', 'eventSbt', 'partneredSbt', 'dcRole']

const tasks = [
  {
    title: 'Obtain an SBT from events',
    chain: ChainId.SEPOLIA,
    id: 'eventSbt',
    icon: <Sbt />
  },
  {
    title: 'Obtain an SBT from partnered collections',
    chain: ChainId.SEPOLIA,
    id: 'partneredSbt',
    icon: <Sbt />
  },
  {
    title: 'Achieve Top 20% Ranking in the Monopoly Campaign',
    chain: ChainId.SEPOLIA,
    id: 'monopolyRank',
    icon: <Monopoly />
  },
  {
    title: "Obtain Discord 'OG' role",
    chain: ChainId.SEPOLIA,
    id: 'dcRole',
    icon: <Social />
  },
  {
    title: 'Connect your email',
    chain: ChainId.SEPOLIA,
    id: 'googleOauth',
    icon: <Social />
  },
  { title: 'Connect your Twitter', chain: ChainId.SEPOLIA, id: 'twitterOauth', icon: <Social /> }
]

interface TaskListLuckProps {
  lucksData: BoxData
  claimBox: (item: LuckItem) => void
}

export default function TaskListLuck({ lucksData, claimBox }: TaskListLuckProps) {
  const { token, sign } = useSignLogin()
  console.log(token, 'token')
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
  }, [lucksData, claimBox])

  return <TaskList type={TYPE.luck} data={taskListData} />
}
