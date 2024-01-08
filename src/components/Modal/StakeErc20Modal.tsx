import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import LinkIcon from 'assets/svg/open_new_link.svg'
import NumericalInputMax from '../../components/Input/InputNumericalMax'
import { CenterBetweenRow, CenterRow } from 'pages/Farm'
import Modal from '.'
import { useActiveWeb3React } from 'hooks'
import { Token } from 'constants/token'
import { STAKE_ERC_TOKEN_ADDRESS } from '../../constants'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import ActionButton from 'components/Button/ActionButton'
import { useTokenBalance } from 'state/wallet/hooks'
import { tryParseAmount } from 'utils/parseAmount'
import { useStakeErc20CallBack } from 'hooks/useStakeCallback'
import useModal from 'hooks/useModal'
import TransacitonPendingModal from './TransactionModals/TransactionPendingModal'
import MessageBox from './TransactionModals/MessageBox'
import TransactiontionSubmittedModal from './TransactionModals/TransactiontionSubmittedModal'
import { useTransactionAdder } from 'state/transactions/hooks'

export default function StackErc20Modal({ onDismiss, currency }: { onDismiss: () => void; currency: Token }) {
  const theme = useTheme()
  const [value, setValue] = useState<string>('')
  const { showModal, hideModal } = useModal()
  const { account } = useActiveWeb3React()
  const { StakeErc20 } = useStakeErc20CallBack()
  const Balances = useTokenBalance(account ?? undefined, currency)
  const [approvalState, approve] = useApproveCallback(
    tryParseAmount(value || undefined, currency),
    STAKE_ERC_TOKEN_ADDRESS,
    true
  )
  const addTransaction = useTransactionAdder()

  const balance = useMemo(() => {
    return Balances?.toExact()
  }, [Balances])

  const onConfirm = useCallback(() => {
    if (!currency || !value) {
      return
    }
    hideModal()

    showModal(<TransacitonPendingModal />)
    StakeErc20(tryParseAmount(value || undefined, currency))
      .then(res => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={res?.hash} />)
        addTransaction(res, {
          summary: 'Stake ERC20'
        })
      })
      .catch(err => {
        hideModal()
        console.error(err)
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'Stake ERC20 Failed'}
          </MessageBox>
        )
      })
  }, [StakeErc20, addTransaction, currency, hideModal, showModal, value])

  const bt = useMemo(() => {
    if (approvalState !== ApprovalState.APPROVED && value) {
      return (
        <ActionButton
          width="100%"
          height="44px"
          onAction={approve}
          padding="0"
          disableAction={approvalState === ApprovalState.PENDING}
          pending={approvalState === ApprovalState.PENDING}
          pendingText={`Approving ${currency?.symbol ?? currency?.name}`}
          actionText={'Approve ' + (currency?.symbol ?? currency?.name)}
        />
      )
    }

    return (
      <Button
        sx={{ height: '44px' }}
        disabled={approvalState !== ApprovalState.APPROVED}
        onClick={() => {
          onConfirm()
        }}
      >
        Confirm
      </Button>
    )
  }, [approvalState, approve, currency?.name, currency?.symbol, onConfirm, value])

  return (
    <Modal customOnDismiss={onDismiss} width="100%" maxWidth="550px" closeIcon closeVariant="button" height="350px">
      <Box
        sx={{
          padding: { xs: '16px 20px', md: '32px 34px' },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Stack>
          <CenterBetweenRow justifyContent="space-between">
            <Typography lineHeight={'28px'} fontSize={'24px'} fontWeight={600}>
              Stake LP tokens
            </Typography>
          </CenterBetweenRow>
          <CenterBetweenRow mt={40}>
            <Typography lineHeight={'19px'} fontSize={'16px'} fontWeight={600}>
              Stake
            </Typography>
            <Typography lineHeight={'19px'} fontSize={'16px'} fontWeight={600}>
              Balance: {balance ? Number(balance).toFixed(10) : 0}
            </Typography>
          </CenterBetweenRow>
          <CenterBetweenRow
            sx={{
              background: '#F6F6F6',
              borderRadius: '8px',
              height: '52px',
              marginTop: '12px',
              mb: 15
            }}
          >
            <NumericalInputMax
              value={value}
              onChange={e => {
                if (e.target.value && Number(e.target.value) > Number(balance) && balance) {
                  setValue(balance)
                  return
                }
                setValue(e.target.value)
              }}
              onMax={() => {
                if (balance) {
                  setValue(balance)
                }
              }}
            />
          </CenterBetweenRow>

          <CenterBetweenRow gap={12} mt={16}>
            <Button
              sx={{
                height: '44px',
                background: theme.palette.background.default,
                color: '#333333'
              }}
              onClick={onDismiss}
            >
              Cancel
            </Button>
            {bt}
          </CenterBetweenRow>
        </Stack>

        <CenterRow justifyContent={'center'}>
          <a style={{ color: '#1F9898' }}>Get LAD-ASD LP</a>
          <img src={LinkIcon} />
        </CenterRow>
      </Box>
    </Modal>
  )
}
