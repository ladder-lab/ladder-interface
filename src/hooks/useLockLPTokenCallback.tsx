import { useLockContract } from './useContract'
import { useGasPriceInfo } from './useGasPrice'
import { useCallback, useMemo, useState } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import useModal from './useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useActiveWeb3React } from 'hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { getTimeDifference } from 'components/Timer'
import { calculateGasMargin } from '../utils'

export interface LeftDateProps {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useLockLPToken() {
  const contract = useLockContract()
  const getGasPrice = useGasPriceInfo()
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const [loading, setLoading] = useState<boolean>(false)

  const LockLPCallback = useCallback(
    async (amount: number | undefined) => {
      console.log('🚀 ~ file: useLockLPTokenCallback.tsx:22 ~ amount:', amount)
      if (!contract) throw new Error('none contract')
      setLoading(true)
      const { gasPrice } = await getGasPrice()
      const estimatedGas = await contract.estimateGas.lock(amount)
      // console.log('🚀 ~ file: useLockLPTokenCallback.tsx:26 ~ estimatedGas:', estimatedGas)
      showModal(<TransacitonPendingModal />)
      return contract
        .lock(amount, { gasLimit: calculateGasMargin(estimatedGas), gasPrice })
        .then((response: TransactionResponse) => {
          setLoading(false)

          hideModal()
          showModal(<TransactionSubmittedModal />)
          addTransaction(response, {
            summary: `Lock LP`,
            claim: { recipient: `${account}_lock_lp` }
          })
        })
        .catch((error: Error) => {
          setLoading(false)
          hideModal()
          showModal(<MessageBox type="error">Failed to Lock LP token</MessageBox>)
          console.debug('Failed to Lock LP token', error)
          throw error
        })
    },
    [account, addTransaction, contract, getGasPrice, hideModal, showModal]
  )
  return { LockLPCallback, loading }
}

export function useIsLockLPTokenCallback() {
  const contract = useLockContract()
  const { account } = useActiveWeb3React()

  const LockTokenInfoRes = useSingleCallResult(contract, 'lockInfos', [account || undefined], undefined)

  const isLock = useMemo(
    () => (LockTokenInfoRes.result?.[0] ? Number(LockTokenInfoRes.result?.[0]) : undefined),
    [LockTokenInfoRes.result]
  )
  console.log('🚀 ~ file: useLockLPTokenCallback.tsx:67 ~ useIsLockLPTokenCallback ~ isLock:', LockTokenInfoRes)

  const LockTokenInfo = useMemo(() => LockTokenInfoRes.result, [LockTokenInfoRes.result])

  const leftDate: LeftDateProps = useMemo(() => {
    const time = LockTokenInfo?.unlockTime ? Number(LockTokenInfo?.unlockTime.toString()) * 1000 : 0
    const endTime = getTimeDifference(time)

    console.log('🚀 ~ file: useLockLPTokenCallback.tsx:64 ~ leftDate ~ endTime:', endTime, time)

    return endTime
  }, [LockTokenInfo?.unlockTime])

  return { leftDate, isLock: !!isLock }
}

export function useClaimLockLPTokenCallback() {
  const contract = useLockContract()
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const [loading, setLoading] = useState<boolean>(false)

  const ClaimLockLPCallback = useCallback(async () => {
    if (!contract) throw new Error('none contract')
    setLoading(true)
    showModal(<TransacitonPendingModal />)
    return contract
      .withdraw()
      .then((response: TransactionResponse) => {
        setLoading(false)
        hideModal()
        showModal(<TransactionSubmittedModal />)
        addTransaction(response, {
          summary: `Withdraw LP`,
          claim: { recipient: `${account}_withdraw_lp` }
        })
      })
      .catch((error: Error) => {
        setLoading(false)

        hideModal()
        showModal(<MessageBox type="error">Failed to Withdraw LP token</MessageBox>)
        console.debug('Failed to Withdraw LP token', error)
        throw error
      })
  }, [account, addTransaction, contract, hideModal, showModal])
  return { ClaimLockLPCallback, loading }
}
