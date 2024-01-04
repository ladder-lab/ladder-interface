import { useStakeContract } from './useContract'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from './index'
import useModal from './useModal'
import { useTransactionAdder } from 'state/transactions/hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactiontionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { BigNumber } from 'ethers'
import { CurrencyAmount } from '@ladder/sdk'
import { Token } from 'constants/token'

export const erc721contract = '0x3ec2Bb9E04C8DB50fb77E170BF9116B330293209'

export function useStakeErc721CallBack(tokenAddress: string) {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const StakeErc721 = useCallback(
    async (tokenIds: any[], amount: number) => {
      if (!contract || !account) {
        throw 'Params error'
      }
      const args = [tokenAddress, tokenIds.map(v => Number(v)), amount]
      return await contract['deposit'](...args)
    },
    [account, contract, tokenAddress]
  )
  return { StakeErc721 }
}

export function useStakeErc20CallBack() {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const StakeErc20 = useCallback(
    async (currency: CurrencyAmount | undefined) => {
      const token = currency?.currency as Token
      if (!contract || !account) {
        throw 'Params error'
      }
      const args = [token?.address, [], currency?.raw.toString()]
      return await contract['deposit'](...args)
    },
    [account, contract]
  )
  return { StakeErc20 }
}

export function useViewRewardCallBack(tokenAddress: string | undefined) {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const [result, SetResult] = useState<BigNumber>()

  useEffect(() => {
    if (!contract || !tokenAddress) {
      return
    }

    ;(async () => {
      try {
        const args = [tokenAddress, account]

        const res = await contract['pendingReward'](...args)
        if (res) {
          SetResult(res)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, contract, tokenAddress])
  return { result }
}

export function useClaimRewardCallBack(tokenAddress: string | undefined) {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const { showModal, hideModal } = useModal()
  const addTransaction = useTransactionAdder()

  const ClaimReward = useCallback(
    async (amount?: string | undefined) => {
      if (!contract || !account || !tokenAddress) {
        return
      }
      showModal(<TransacitonPendingModal />)
      try {
        console.log('🚀 ~ file: useStakeCallBack.tsx:64 ~ amount:', amount)
        const args = [tokenAddress, amount ? Number(amount) : 0]
        const res = await contract['withdraw'](...args)
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={res?.hash} />)
        addTransaction(res, {
          summary: !amount ? 'Claim Reward' : 'Redeem Principal',
          claim: {
            recipient: !amount
              ? `${account}_${tokenAddress}_claim_reward`
              : `${account}_${tokenAddress}_redeem_principal`
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
    [account, addTransaction, contract, tokenAddress, hideModal, showModal]
  )
  return {
    ClaimReward
  }
}

export function useUserStakeInfoCallBack(tokenAddress: string | undefined) {
  const { account } = useActiveWeb3React()
  const contract = useStakeContract()
  const [result, SetResult] = useState<any>()

  useEffect(() => {
    if (!contract || !tokenAddress) {
      return
    }

    ;(async () => {
      try {
        const args = [tokenAddress, account]

        const res = await contract['userInfo'](...args)
        if (res) {
          SetResult(res)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, contract, tokenAddress])
  return { result }
}
