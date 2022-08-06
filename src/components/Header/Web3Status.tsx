import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, styled, Typography, Button } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
import { ReactComponent as Web3StatusIconSvg } from 'assets/svg/web3status_icon.svg'
import useBreakpoint from 'hooks/useBreakpoint'

const ActionButton = styled(Button)(({ theme }) => ({
  fontSize: '14px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 320,
    width: '100%',
    borderRadius: '8px',
    marginBottom: 0
  }
}))

const Web3StatusIcon = styled(Web3StatusIconSvg)(() => ({
  height: 28,
  width: 28
}))

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, error } = useWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  const isDownSm = useBreakpoint()

  if (account) {
    return (
      <Box sx={{ cursor: 'pointer' }} onClick={toggleWalletModal}>
        <Box
          sx={{
            height: { xs: 46, sm: 46 },
            width: 'fit-content',
            borderRadius: '8px',
            display: 'flex',
            gap: 13,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            padding: {
              xs: '6px 9px 6px 16px',
              md: '6px 9px 6px 25px'
            }
          }}
        >
          <Box>
            {hasPendingTransactions ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 10, sm: 17 }, ml: { xs: 10, sm: 20 } }}>
                <Spinner color={theme.palette.text.primary} size={isDownSm ? '10px' : '16px'} />
                <Box component="span" sx={{ ml: 3 }}>
                  <Typography sx={{ fontSize: { xs: 9, sm: 14 }, ml: 8, color: theme.palette.text.primary }} noWrap>
                    {pending?.length} Pending
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: 11, sm: 14 },
                  color: theme.palette.text.secondary
                }}
              >
                {ENSName || shortenAddress(account)}
              </Typography>
            )}
          </Box>
          <Web3StatusIcon />
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '36px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </ActionButton>
    )
  } else {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '36px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        Connect Wallet
      </ActionButton>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
