import { Box, Button, Typography, Grid } from '@mui/material'
import { Token721 } from 'constants/token/token721'
import Modal from '.'
import { Loader } from 'components/AnimatedSvg/Loader'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'
import { useERC721Tokens } from 'state/swap/useSwap721State'
import { useToken721PoolIds } from 'hooks/useToken721PoolIds'

import SwitchToggle from 'components/SwitchToggle'
import Pagination from 'components/Pagination'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'
import { NftCard } from './Erc721IdSelectionModal'
import { ApprovalState } from 'hooks/useApproveCallback'
// import { useMintActionHandlers } from 'state/mint/hooks'
import ActionButton from 'components/Button/ActionButton'
import { erc721contract, useStakeErc721CallBack } from 'hooks/useStakeCallback'
import { useNFTApproveAllCallback } from 'hooks/useNFTApproveAllCallback'
import { STAKE_ERC_TOKEN_ADDRESS } from '../../constants'
import TransacitonPendingModal from './TransactionModals/TransactionPendingModal'
import useModal from 'hooks/useModal'
import MessageBox from './TransactionModals/MessageBox'
import { useTransactionAdder } from 'state/transactions/hooks'
import TransactiontionSubmittedModal from './TransactionModals/TransactiontionSubmittedModal'

export default function StakeNftSelectModal({
  onDismiss,
  collection,
  // onSelectSubTokens,
  pairAddress,
  setAmount
}: {
  onDismiss: () => void
  collection?: Token721
  // onSelectSubTokens: (tokens: Token721[]) => void
  pairAddress?: string
  setAmount?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [searchId, setSearchId] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const isDownMd = useBreakpoint('md')
  const { StakeErc721 } = useStakeErc721CallBack(erc721contract)
  const { onClearTokens, tokens, onToggleToken, setTokens } = useERC721Tokens()
  const { showModal, hideModal } = useModal()
  const balance = useToken721Balance(pairAddress ? undefined : collection)
  const { loading, availableTokens } = useToken721BalanceTokens(balance)
  const { loading: poolLoading, poolTokens, page } = useToken721PoolIds(pairAddress, collection)
  const addTransaction = useTransactionAdder()

  const [filteredAvailableTokens, setFilteredAvailableTokens] = useState(pairAddress ? poolTokens : availableTokens)

  const onConfirm = useCallback(() => {
    if (!collection) {
      return
    }
    hideModal()
    setAmount && setAmount({ target: { value: tokens.length + '' } } as any)
    const tokenIds = tokens.map(({ tokenId }) => tokenId)
    setFilteredAvailableTokens((prev: Token721[] | undefined) => {
      return prev?.filter((token: Token721) => !tokenIds.includes(token.tokenId))
    })
    showModal(<TransacitonPendingModal />)
    StakeErc721(tokenIds, tokenIds.length)
      .then(res => {
        hideModal()
        showModal(<TransactiontionSubmittedModal hash={res?.hash} />)
        addTransaction(res, {
          summary: 'Stake ERC721'
        })
      })
      .catch(err => {
        hideModal()
        console.error(err)
        showModal(
          <MessageBox type="error">
            {err?.reason || err?.data?.message || err?.error?.message || err?.message || 'Stake ERC721 Failed'}
          </MessageBox>
        )
      })
  }, [StakeErc721, addTransaction, collection, hideModal, setAmount, showModal, tokens])

  const searchIdToken = useMemo(() => {
    if (!filteredAvailableTokens || searchId == '') return undefined
    const res = filteredAvailableTokens.find((token: Token721) => (token.tokenId + '').includes(searchId))
    return res ? res : null
  }, [filteredAvailableTokens, searchId])

  const resetSearchId = useCallback(() => {
    setSearchId('')
  }, [])

  useEffect(() => {
    onClearTokens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, availableTokens])

  useEffect(() => {
    setFilteredAvailableTokens(pairAddress ? poolTokens : availableTokens)
  }, [availableTokens, pairAddress, poolTokens])

  const modalHeight = useCurrencyModalListHeight('0px')
  const [approvalState, approve] = useNFTApproveAllCallback(erc721contract, STAKE_ERC_TOKEN_ADDRESS, true)

  const bt = useMemo(() => {
    if (loading || poolLoading) {
      return (
        <Button sx={{ height: 60, width: '100%', maxWidth: 300 }} disabled>
          {tokens.length} {collection?.symbol ?? collection?.name} Stake
        </Button>
      )
    }

    if (approvalState !== ApprovalState.APPROVED && !!filteredAvailableTokens?.length) {
      return (
        <ActionButton
          width="300px"
          height="60px"
          onAction={approve}
          disableAction={approvalState === ApprovalState.PENDING}
          pending={approvalState === ApprovalState.PENDING}
          pendingText={`Approving ${collection?.symbol ?? collection?.name}`}
          actionText={'Approve ' + (collection?.symbol ?? collection?.name)}
        />
      )
    }
    return (
      <Button onClick={onConfirm} sx={{ height: 60, width: '100%', maxWidth: 300 }} disabled={tokens.length === 0}>
        {tokens.length} {collection?.symbol ?? collection?.name} Stake
      </Button>
    )
  }, [
    approvalState,
    approve,
    collection?.name,
    collection?.symbol,
    filteredAvailableTokens?.length,
    loading,
    onConfirm,
    poolLoading,
    tokens.length
  ])

  return (
    <Modal
      customOnDismiss={onDismiss}
      width="100%"
      height={isDownMd ? modalHeight : '60vh'}
      maxWidth="680px"
      minHeight={isDownMd ? 'unset' : '580px'}
      closeIcon
      closeVariant="button"
      padding={isDownMd ? '28px 16px' : '32px 32px'}
    >
      <Box width="100%" display="flex" gap={14} alignItems="center" pb={30}>
        <Typography
          variant="h5"
          sx={{
            fontSize: {
              xs: 14,
              md: 24
            }
          }}
        >
          Select Stake a NFT
        </Typography>
      </Box>
      <Box mt={20}>
        <Box sx={{ display: { xs: 'grid', md: 'flex' }, alignItems: 'center', gap: 12 }}>
          <Box display="flex" alignItems="center" gap={5} marginLeft="auto">
            <Typography>Select all</Typography>
            <SwitchToggle
              checked={selectAll}
              disabled={!filteredAvailableTokens || !filteredAvailableTokens.length}
              onChange={() => {
                setSelectAll(state => {
                  if (!state) {
                    setTokens(filteredAvailableTokens)
                  } else {
                    setTokens([])
                  }
                  return !state
                })
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          margin: '20px 0',
          height: '100%',
          maxHeight: 'calc(100% - 180px)'
        }}
      >
        <Box display="flex" flexDirection="column" gap={20}>
          <Box sx={{ minHeight: 290, width: '100%' }}>
            {loading || poolLoading ? (
              <Box width={'100%'} display="flex" mt={20} alignItems="center" justifyContent="center">
                <Loader />
              </Box>
            ) : (
              <Grid container spacing={6} width="100%">
                {(searchIdToken === null ||
                  filteredAvailableTokens?.length === 0 ||
                  (!filteredAvailableTokens && !loading)) && (
                  <Box width={'100%'} display="flex" alignItems="center" justifyContent="center" mt={100}>
                    <Typography
                      textAlign="center"
                      mb="20px"
                      fontSize={16}
                      fontWeight={500}
                      component="div"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      No results found.
                    </Typography>
                  </Box>
                )}
                {searchIdToken && (
                  <Grid item xs={6} md={3}>
                    <NftCard
                      selected={!!tokens.find(item => item.tokenId === searchIdToken.tokenId)}
                      token={searchIdToken}
                      onClick={() => {
                        onToggleToken(searchIdToken)
                        resetSearchId()
                      }}
                      disabled={false}
                    />{' '}
                  </Grid>
                )}
                {searchIdToken === undefined &&
                  filteredAvailableTokens?.map((token: Token721) => {
                    const selected = tokens.filter(item => item.tokenId === token.tokenId)
                    return (
                      <Grid item key={token.tokenId} xs={6} md={3}>
                        <NftCard
                          selected={!!selected.length}
                          token={token}
                          onClick={() => {
                            onToggleToken(token)
                            resetSearchId()
                          }}
                          disabled={false}
                        />
                      </Grid>
                    )
                  })}
              </Grid>
            )}
            {pairAddress && (
              <Box pt={20} pb={10}>
                <Pagination
                  onChange={(_, curPage) => page.setCurrentPage(curPage)}
                  total={page.count}
                  count={page.totalPage}
                  page={page.currentPage}
                  perPage={page.pageSize}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap={16} margin="15px 0 0" justifyContent={'center'}>
        {bt}
      </Box>
    </Modal>
  )
}
