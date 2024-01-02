import { Box, Button, Typography, Grid } from '@mui/material'
import { Token721 } from 'constants/token/token721'
import Modal from '.'
import { Loader } from 'components/AnimatedSvg/Loader'
import useBreakpoint from 'hooks/useBreakpoint'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'
import { useERC721Tokens } from 'state/swap/useSwap721State'
import { useToken721PoolIds } from 'hooks/useToken721PoolIds'

import SwitchToggle from 'components/SwitchToggle'
import Pagination from 'components/Pagination'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'
import { NftCard } from './Erc721IdSelectionModal'

export default function StakeNftSelectModal({
  onDismiss,
  collection,
  onSelectSubTokens,
  pairAddress,
  setAmount
}: {
  onDismiss: () => void
  collection?: Token721
  onSelectSubTokens: (tokens: Token721[]) => void
  pairAddress?: string
  setAmount?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [searchId, setSearchId] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const isDownMd = useBreakpoint('md')
  const container = useRef<any>(null)
  console.log('🚀 ~ file: Erc721IdSelectionModal.tsx:42 ~ collection:', collection)

  const { onClearTokens, tokens, onToggleToken, setTokens } = useERC721Tokens()

  const balance = useToken721Balance(pairAddress ? undefined : collection)
  const { loading, availableTokens } = useToken721BalanceTokens(balance)
  const { loading: poolLoading, poolTokens, page } = useToken721PoolIds(pairAddress, collection)

  const [filteredAvailableTokens, setFilteredAvailableTokens] = useState(pairAddress ? poolTokens : availableTokens)

  const onConfirm = useCallback(() => {
    if (!collection) {
      return
    }
    setAmount && setAmount({ target: { value: tokens.length + '' } } as any)
    onSelectSubTokens && onSelectSubTokens([...tokens])
    const tokenIds = tokens.map(({ tokenId }) => tokenId)
    setFilteredAvailableTokens((prev: Token721[] | undefined) => {
      return prev?.filter((token: Token721) => !tokenIds.includes(token.tokenId))
    })

    onDismiss()
  }, [collection, onDismiss, onSelectSubTokens, setAmount, tokens])

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

  return (
    <Modal
      customOnDismiss={onDismiss}
      width="100%"
      height={isDownMd ? modalHeight : '60vh'}
      maxWidth="680px"
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
          maxHeight: { xs: 'calc(100% - 180px)', md: '466px' }
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
      <Box>
        <Box
          margin="15px 0 0"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          ref={container}
        >
          <Button onClick={onConfirm} sx={{ height: 60, width: 300 }} disabled={tokens.length === 0}>
            {tokens.length} NFTs has been chosen
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
