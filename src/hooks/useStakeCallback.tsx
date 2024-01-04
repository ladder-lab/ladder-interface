import { useStakeContract } from './useContract'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from './index'
import useModal from './useModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { BigNumber } from 'ethers'

export const erc721contract = '0x3ec2Bb9E04C8DB50fb77E170BF9116B330293209'

export function useStakeErc721CallBack() {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const StakeErc721 = useCallback(
    async (tokenIds: any[], amount: number) => {
      if (!contract || !account) {
        throw 'Params error'
      }
      const args = [erc721contract, tokenIds.map(v => Number(v)), amount]
      return await contract['deposit'](...args)
    },
    [account, contract]
  )
  return { StakeErc721 }
}

export function useViewRewardCallBack() {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const [result, SetResult] = useState<BigNumber>()

  useEffect(() => {
    if (!contract) {
      return
    }

    ;(async () => {
      try {
        const args = [erc721contract, account]

        const res = await contract['pendingReward'](...args)
        if (res) {
          SetResult(res)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, contract])
  return { result }
}

export function useClaimRewardCallBack() {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()

  const ClaimReward = useCallback(
    async (amount?: string | undefined) => {
      if (!contract || !account) {
        throw 'Params error'
      }
      showModal(<TransacitonPendingModal />)
      try {
        console.log('🚀 ~ file: useStakeCallBack.tsx:64 ~ amount:', amount)
        const args = [erc721contract, amount ? Number(amount) : 0]
        const res = await contract['withdraw'](...args)
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={res?.hash} />)
        addTransaction(res, {
          summary: !amount ? 'Claim Reward' : 'Redeem Principal',
          claim: {
            recipient: !amount
              ? `${account}_${erc721contract}_claim_reward`
              : `${account}_${erc721contract}_redeem_principal`
          }
        })
      } catch (err: any) {
        hideModal()
        console.error(err)
        showModal(
          <MessageBox type="error">
            {err?.reason ||
              err?.data?.message ||
              err?.error?.message ||
              err?.message ||
              (!amount ? 'Claim Reward Failed' : 'Redeem Principal Failed')}
          </MessageBox>
        )
      }
    },
    [account, addTransaction, contract, hideModal, showModal]
  )
  return {
    ClaimReward
  }
}

export function useUserStakeInfoCallBack() {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const [result, SetResult] = useState<any>()

  useEffect(() => {
    if (!contract) {
      return
    }

    ;(async () => {
      try {
        const args = [erc721contract, account]

        const res = await contract['userInfo'](...args)
        if (res) {
          SetResult(res)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, contract])
  return { result }
}
