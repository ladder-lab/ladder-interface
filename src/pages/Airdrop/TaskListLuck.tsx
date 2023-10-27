import { ChainId } from '@ladder/sdk'
import TaskList, { TYPE, TaskListData } from './TaskList'
import { useLuckTasks, useVerifyEmail } from 'hooks/useAirdrop'
import { useMemo } from 'react'
import { IncompleteModal, LuckModal } from './AirdropModal'
import useModal from 'hooks/useModal'
import { ReactComponent as Monopoly } from 'assets/svg/airdrop/monopoly.svg'
import { ReactComponent as Social } from 'assets/svg/airdrop/social.svg'
import { ReactComponent as Sbt } from 'assets/svg/airdrop/sbt.svg'
import { useVerifyTwitter } from 'hooks/useVerifyTwitter'
import { useSignLogin } from 'hooks/useSignIn'

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

export default function TaskListLuck({ refreshCb }: { refreshCb: () => void }) {
  const { showModal } = useModal()
  const { getLuck, taskState: state } = useLuckTasks(refreshCb)
  const { token, sign } = useSignLogin()

  const { openVerify, isLoading: twitterIsLoading } = useVerifyTwitter(true)
  const { openVerify: openVerifyEmail, isLoading: emailIsLoading } = useVerifyEmail()

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
              if (expiredList.includes(item.id) && !itemState.completed) {
                acc.cannotComplete.push({
                  ...item,
                  completed: itemState.completed,
                  claimed: itemState.claimed,
                  expired: true
                })
                return acc
              }
              acc.canBeDone.push({
                ...item,
                completed: itemState.completed,
                claimed: itemState.claimed,
                statusText:
                  item.id === 'twitterOauth'
                    ? !token
                      ? 'Sign'
                      : !itemState.completed
                      ? 'Connect'
                      : 'Boost'
                    : item.id === 'googleOauth'
                    ? !token
                      ? 'Sign'
                      : !itemState.completed
                      ? 'Connect'
                      : 'Boost'
                    : undefined,
                isLoading:
                  item.id === 'twitterOauth' ? twitterIsLoading : item.id === 'googleOauth' ? emailIsLoading : false,
                action: () => {
                  !token
                    ? sign()
                    : itemState.completed
                    ? showModal(<LuckModal getLuck={getLuck({ luckType: itemState.luckType, luck: itemState.luck })} />)
                    : showModal(
                        <IncompleteModal
                          action={
                            item.id === 'twitterOauth'
                              ? openVerify
                              : item.id === 'googleOauth'
                              ? openVerifyEmail
                              : undefined
                          }
                        />
                      )
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
    [emailIsLoading, getLuck, openVerify, openVerifyEmail, showModal, sign, state, token, twitterIsLoading]
  )

  return <TaskList type={TYPE.luck} data={sorted} />
}
