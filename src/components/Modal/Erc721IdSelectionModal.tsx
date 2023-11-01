import { Box, Button, IconButton, Typography, useTheme, Grid } from '@mui/material'
import { Token721 } from 'constants/token/token721'
import { useIsDarkMode } from 'state/user/hooks'
import Modal from '.'
import { Loader } from 'components/AnimatedSvg/Loader'
import useBreakpoint from 'hooks/useBreakpoint'
import LogoText from 'components/LogoText'
import { CloseIcon, ExternalLink } from 'theme/components'
import { ReactComponent as Xcircle } from 'assets/svg/xcircle.svg'
// import { ReactComponent as XcircleSm } from 'assets/svg/xcirclesm.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as ExternalIcon } from 'assets/svg/external_arrow.svg'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'
import { shortenAddress } from 'utils'
import { useERC721Tokens } from 'state/swap/useSwap721State'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import { useToken721PoolIds } from 'hooks/useToken721PoolIds'

import LogoBase from 'components/essential/CurrencyLogo/LogoBase'
import InputNumerical from 'components/Input/InputNumerical'
import Close from '@mui/icons-material/Close'
import SwitchToggle from 'components/SwitchToggle'
import { useCurrencyModalListHeight } from 'hooks/useScreenSize'
import Pagination from 'components/Pagination'
// import { useContract } from 'hooks/useContract'
// import ERC3525_ABI from 'constants/abis/erc3525.json'
// import { useSingleCallResult } from 'state/multicall/hooks'
// import { Token, TokenAmount } from '@ladder/sdk'
// import { ZERO_ADDRESS } from 'constants/index'

export default function Erc721IdSelectionModal({
  // isOpen,
  onDismiss,
  collection,
  onSelectSubTokens,
  pairAddress,
  setAmount
}: {
  // isOpen: boolean
  onDismiss: () => void
  collection?: Token721
  onSelectSubTokens: (tokens: Token721[]) => void
  pairAddress?: string
  setAmount?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [searchId, setSearchId] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const isDownMd = useBreakpoint('md')
  const container = useRef<any>(null)
  const [insufficiantTokenMap, setInsufficientTokenMap] = useState<{ [key: string]: boolean }>({})

  const { onClearTokens, onRemoveToken, tokens, onToggleToken, setTokens } = useERC721Tokens()

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

  const searchIdTokens = useMemo(() => {
    if (!filteredAvailableTokens || searchId == '') return undefined
    const res = filteredAvailableTokens.filter((token: Token721) => (token.tokenId + '').includes(searchId))
    return res ? res : null
  }, [filteredAvailableTokens, searchId])

  const handleSearchId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value)
  }, [])

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

  const listHeight = useCurrencyModalListHeight(isDownMd ? '400px' : '375px')
  const modalHeight = useCurrencyModalListHeight('0px')

  return (
    <Modal
      customOnDismiss={onDismiss}
      width="100%"
      height={modalHeight}
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
          Select a NFT
        </Typography>
      </Box>
      <InputNumerical
        integer
        value={searchId}
        onChange={handleSearchId}
        placeholder="Search NFT token ID"
        endAdornment={<CloseIcon onClick={resetSearchId} sx={{ position: 'static' }} />}
        startAdornment={<SearchIcon />}
        onKeyDown={handleSearchId}
        height={isDownMd ? 48 : 60}
      />
      <Box mt={20}>
        <Box sx={{ display: { xs: 'grid', md: 'flex' }, alignItems: 'center', gap: 12 }}>
          <Typography>Collection:</Typography>
          <Box
            sx={{
              borderRadius: '8px',
              background: theme => theme.palette.background.default,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 52,
              padding: '0px 23px'
            }}
          >
            {collection?.name}
            <ExternalIcon />
          </Box>
          <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
            {collection ? shortenAddress(collection.address) : ''}
          </ExternalLink>
          <Box display="flex" alignItems="center" gap={5} marginLeft="auto">
            <Typography>Select all</Typography>
            <SwitchToggle
              checked={selectAll}
              disabled={!filteredAvailableTokens || !filteredAvailableTokens.length}
              onChange={() => {
                setSelectAll(state => {
                  if (!state) {
                    const tokenList = searchIdTokens ?? filteredAvailableTokens
                    if (tokenList) {
                      setTokens(tokenList?.filter((token: any) => !insufficiantTokenMap[token.tokenId + '']))
                    }
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
      <Box sx={{ overflow: 'auto', height: listHeight, margin: '20px 0' }}>
        <Box display="flex" flexDirection="column" gap={20}>
          <Box sx={{ minHeight: 290, width: '100%' }}>
            {loading || poolLoading ? (
              <Box width={'100%'} display="flex" mt={20} alignItems="center" justifyContent="center">
                <Loader />
              </Box>
            ) : (
              <Grid container spacing={6} width="100%">
                {(searchIdTokens === null ||
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
                {searchIdTokens &&
                  searchIdTokens?.map((token: Token721) => {
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
                          setInsufficientTokenMap={setInsufficientTokenMap}
                        />
                      </Grid>
                    )
                  })}
                {searchIdTokens === undefined &&
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
                          setInsufficientTokenMap={setInsufficientTokenMap}
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
          <Button
            onClick={onConfirm}
            sx={{ height: 60, width: 300 }}
            disabled={tokens.length === 0}
            // disabled={!!amount && tokens.length !== amount}
          >
            {tokens.length} NFTs has been chosen
            {/* {tokens.length === amount
                      ? `${tokens.length}/${amount} Confirm`
                      : amount === 0
                      ? `${tokens.length} NFTs has been chosen`
                      : `${amount} NFTs should be chosen`} */}
          </Button>
          {tokens.length > 0 && (
            <Button
              variant="text"
              sx={{ width: 85 }}
              onClick={() => {
                setDetailsOpen(state => !state)
              }}
            >
              {detailsOpen ? <Close /> : 'Details'}
            </Button>
          )}
          {detailsOpen && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '100%',
                boxShadow: 'none',
                maxHeight: isDownMd ? 200 : 300,
                height: 'max-content',
                paddingBottom: 20,
                background: theme => theme.palette.background.paper,
                zIndex: 1200,
                width: '100%'
              }}
            >
              {tokens.length > 0 && (
                <Box width="100%" mt={{ xs: 0, md: 28 }}>
                  {tokens.map((token, idx) => (
                    <Box
                      key={`${token.symbol}-${idx}`}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                    >
                      <LogoText
                        logo={<CurrencyLogo currency={token} />}
                        text={token.name + `#${token.tokenId}`}
                        fontSize={12}
                      />
                      <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
                        {shortenAddress(token.address)}
                      </ExternalLink>
                      <Typography sx={{ fontSize: 12 }}>Quantity: 1</Typography>
                      <IconButton onClick={() => onRemoveToken(token)}>
                        <Xcircle />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

function NftCard({
  token,
  onClick,
  disabled,
  selected = false,
  setInsufficientTokenMap
}: {
  token: Token721
  onClick: () => void
  disabled: boolean
  selected?: boolean
  setInsufficientTokenMap: any
}) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const [insufficientAmount] = useState(false)

  // const arg = useMemo(() => [token.tokenId], [token])

  // const contract = useContract(token.address, ERC3525_ABI)
  // const result = useSingleCallResult(contract, 'assets', arg)

  // const amount = useMemo(() => {
  //   const res = result.result?.[1]?.toString() ?? '0'
  //   const amountInString = new TokenAmount(new Token(1, ZERO_ADDRESS, 18), res).toExact()

  //   if (Number(amountInString) >= 250) {
  //     setInsufficientAmount(false)
  //   }

  //   return amountInString
  // }, [result.result])

  useEffect(() => {
    if (token.tokenId !== undefined) {
      setInsufficientTokenMap((prev: any) => {
        return { ...prev, [token.tokenId + '']: insufficientAmount } as { [key: string]: boolean }
      })
    }
  }, [insufficientAmount, setInsufficientTokenMap, token.tokenId])

  return (
    <Box
      onClick={disabled || insufficientAmount ? undefined : onClick}
      sx={{
        border: '1px solid transparent',
        borderColor: selected ? theme.palette.primary.main : 'transparnet',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'center',
        borderRadius: '8px',
        background: isDarkMode ? '#15171A' : '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        opacity: disabled || insufficientAmount ? 0.5 : 1,
        '&:hover':
          disabled || insufficientAmount
            ? {}
            : {
                boxShadow: isDarkMode ? 'none' : '0px 3px 10px rgba(0, 0, 0, 0.15)',
                background: isDarkMode ? '#2E3133' : '#FFFFFF',
                cursor: 'pointer'
              }
      }}
    >
      <Box sx={{ width: '100%', height: 120, overflow: 'hidden' }}>
        {token.tokenUri ? (
          <MetaDataLogo token={token} />
        ) : (
          <LogoBase
            srcs={token.uri ? [token.uri] : []}
            alt={token.name ?? ''}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}
      </Box>
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: 600,
          mt: 8,

          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        {token.name ?? ''}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mb: 8 }}>
        #{token.tokenId ?? ''}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address) ?? ''}
      </Typography>
      {/* <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        <span style={{ color: theme.palette.text.secondary }}>amount: </span> {amount}
      </Typography> */}
    </Box>
  )
}

function MetaDataLogo({ token }: { token: Token721 }) {
  const [curUri, setCurUri] = useState(token.uri)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    if (token.uri || curUri) {
      token.uri !== curUri && token.uri && setCurUri(token.uri)
      return
    } else {
      setTimeout(() => setReload(Math.random()), 3000)
    }
  }, [reload, curUri, token.uri])

  return (
    <LogoBase
      srcs={curUri ? [curUri] : []}
      alt={token.name ?? ''}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }}
    />
  )
}
