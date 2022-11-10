import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useCallback, useEffect, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Axios } from 'utils/axios'
import { useMerkleContract } from './useContract'
import useModal from './useModal'

export enum ClaimState {
  UNKNOWN,
  NOT_REGISTERED,
  CLAIMED,
  UNCLAIMED
}

export function useTestnetClaim(account: string | undefined) {
  const [data, setData] = useState<null | { proof: string[]; index: string }>(null)
  const [claimState, setClaimState] = useState<ClaimState>(ClaimState.UNKNOWN)
  const { showModal, hideModal } = useModal()
  const contract = useMerkleContract()
  const addTransaction = useTransactionAdder()

  useEffect(() => {
    if (!contract || !account) return
    ;(async () => {
      try {
        const signRes = await Axios.post<{ proofList: string[]; index: string; address: string }>(
          'accountSign',
          {},
          {
            publicAddress: account
          }
        )
        if (signRes.data?.data?.index) {
          const claimed = await contract.isClaimed(signRes.data.data.index)
          if (claimed) {
            setClaimState(ClaimState.CLAIMED)
          } else {
            setClaimState(ClaimState.UNCLAIMED)
            setData({ index: signRes.data.data.index, proof: signRes.data.data.proofList })
          }
        } else {
          setClaimState(ClaimState.NOT_REGISTERED)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [account, contract, showModal])

  const testnetClaim = useCallback(async () => {
    if (claimState === ClaimState.NOT_REGISTERED) {
      return showModal(<MessageBox type="warning">Your address is not registered yet </MessageBox>)
    }

    if (claimState !== ClaimState.UNCLAIMED) return

    if (!contract || !data || !account) return

    try {
      showModal(<TransacitonPendingModal />)
      const res = await contract.claim(data.index, account, data.proof)
      addTransaction(res, {
        summary: 'Claim test assets'
      })
      hideModal()
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      hideModal()
      showModal(<MessageBox type="error">Claim Test assets Failed</MessageBox>)
      console.error(e)
    }
  }, [account, addTransaction, claimState, contract, data, hideModal, showModal])

  const devTestnetClaim = useCallback(async () => {
    if (!contract || !account) return

    try {
      showModal(<TransacitonPendingModal />)
      const res = await contract.claim1(account)
      addTransaction(res, {
        summary: 'Claim dev assets'
      })
      hideModal()
      showModal(<TransactionSubmittedModal />)
    } catch (e) {
      hideModal()
      showModal(<MessageBox type="error">Claim dev assets Failed</MessageBox>)
      console.error(e)
    }
  }, [addTransaction, contract, hideModal, showModal])

  return { testnetClaim, claimState, devTestnetClaim }
}
