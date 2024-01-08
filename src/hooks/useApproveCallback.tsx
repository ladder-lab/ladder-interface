import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useTokenAllowance } from '../data/Allowances'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'
import { Trade, CurrencyAmount, TokenAmount, ETHER } from '@ladder/sdk'
import { computeSlippageAdjustedAmounts } from 'utils/swap/prices'
import { ROUTER_ADDRESS, ROUTER_ADDRESS_721 } from 'constants/index'
import { Field } from 'state/swap/actions'
import { useApproveERC1155Callback } from './useApproveERC1155Callback'
import { checkIs1155, checkIs721, filter1155, filter721 } from 'utils/checkIs1155'
import { AllTokens } from 'models/allTokens'
import useModal from './useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransacitonPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useApproveERC721Callback } from './useApproveERC721Callback'
import { useERC20ApproveModeManager } from 'state/user/hooks'
import { useGasPriceInfo } from './useGasPrice'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string,
  noClose?: boolean
): [ApprovalState, () => Promise<void>] {
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const getGasPrice = useGasPriceInfo()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()
  const [isERC20ApproveAllMode] = useERC20ApproveModeManager()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    // let useExact = false
    // const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
    //   // general fallback for tokens who restrict approval amounts
    //   useExact = true
    //   return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    // })

    const estimatedGas = await tokenContract.estimateGas.approve(
      spender,
      isERC20ApproveAllMode ? MaxUint256 : amountToApprove.raw.toString()
    )

    const { gasPrice } = await getGasPrice()

    !noClose && showModal(<TransacitonPendingModal />)
    return tokenContract
      .approve(spender, isERC20ApproveAllMode ? MaxUint256 : amountToApprove.raw.toString(), {
        // .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
        gasPrice
      })
      .then((response: TransactionResponse) => {
        if (!noClose) {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        }
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        if (!noClose) {
          hideModal()
          showModal(<MessageBox type="error">Failed to approve token</MessageBox>)
        }
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    isERC20ApproveAllMode,
    getGasPrice,
    noClose,
    showModal,
    hideModal,
    addTransaction
  ])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const { chainId } = useActiveWeb3React()
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT as Field] : undefined),
    [trade, allowedSlippage]
  )

  return useApproveCallback(amountToApprove, ROUTER_ADDRESS(chainId))
}

export function useAllTokenApproveCallback(token: AllTokens | undefined, amount?: CurrencyAmount, is721Pair?: boolean) {
  const { chainId } = useActiveWeb3React()
  const is1155 = checkIs1155(token)
  const is721 = checkIs721(token)
  const erc20 = useApproveCallback(
    is1155 || is721 ? undefined : amount,
    is721Pair ? ROUTER_ADDRESS_721(chainId) : ROUTER_ADDRESS(chainId)
  )
  const erc1155 = useApproveERC1155Callback(filter1155(token))
  const erc721 = useApproveERC721Callback(filter721(token))
  return is721 ? erc721 : is1155 ? erc1155 : erc20
}
