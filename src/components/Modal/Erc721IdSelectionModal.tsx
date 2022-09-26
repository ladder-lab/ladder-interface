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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'
import { shortenAddress } from 'utils'
import { useERC721Tokens } from 'state/swap/useSwap721State'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import { useToken721PoolIds } from 'hooks/useToken721PoolIds'

import LogoBase from 'components/essential/CurrencyLogo/LogoBase'
import InputNumerical from 'components/Input/InputNumerical'

export default function Erc721IdSelectionModal({
  // isOpen,
  onDismiss,
  collection,
  onSelectSubTokens,
  amount,
  pairAddress,
  setAmount
}: {
  // isOpen: boolean
  onDismiss: () => void
  collection?: Token721
  onSelectSubTokens: (tokens: Token721[]) => void
  amount: number
  pairAddress?: string
  setAmount?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [searchId, setSearchId] = useState('')
  const isDownMd = useBreakpoint('md')

  const { onClearTokens, onRemoveToken, tokens, onToggleToken } = useERC721Tokens()

  const balance = useToken721Balance(pairAddress ? undefined : collection)
  const { loading, availableTokens } = useToken721BalanceTokens(balance)
  const { loading: poolLoading, poolTokens } = useToken721PoolIds(pairAddress, collection)

  const [filteredAvailableTokens, setFilteredAvailableTokens] = useState(pairAddress ? poolTokens : availableTokens)

  const onConfirm = useCallback(() => {
    if (!collection || (!!amount && tokens.length !== amount)) {
      return
    }
    if (amount === 0) {
      setAmount && setAmount({ target: { value: tokens.length + '' } } as any)
    }
    onSelectSubTokens && onSelectSubTokens([...tokens])
    const tokenIds = tokens.map(({ tokenId }) => tokenId)
    setFilteredAvailableTokens((prev: Token721[] | undefined) => {
      return prev?.filter((token: Token721) => !tokenIds.includes(token.tokenId))
    })

    onDismiss()
  }, [amount, collection, onDismiss, onSelectSubTokens, setAmount, tokens])

  const searchIdToken = useMemo(() => {
    if (!filteredAvailableTokens || searchId == '') return undefined
    const res = filteredAvailableTokens.find((token: Token721) => (token.tokenId + '').includes(searchId))
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
  }, [collection, availableTokens, amount])

  useEffect(() => {
    setFilteredAvailableTokens(pairAddress ? poolTokens : availableTokens)
  }, [availableTokens, pairAddress, poolTokens])

  return (
    <Modal
      // customIsOpen={isOpen}
      customOnDismiss={onDismiss}
      width="100%"
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
      <Box sx={{ overflow: 'auto', height: isDownMd ? 357 : 500, margin: '20px 0' }}>
        {' '}
        <Box display="flex" flexDirection="column" gap={20}>
          <Box>
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
            </Box>
            {tokens.length > 0 && (
              <Box width="100%" mt={{ xs: 0, md: 28 }}>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 12, mb: 24 }}>
                  <Typography>Collection:</Typography>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      background: theme => theme.palette.background.default,
                      padding: '0px 18px',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      height: {
                        xs: 36,
                        md: 52
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: 12, md: 16 }, fontWeight: 500 }}>
                      {collection?.name} <ExternalIcon />
                    </Typography>
                    {/* <XcircleSm onClick={onRemoveCollection} style={{ cursor: 'pointer' }} />
                  </Box>
                </Box> */}
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
                {!!amount && (
                  <Typography fontSize={20} textAlign="center" margin="20px 0 0" color="primary">
                    {tokens.length}/{amount}
                  </Typography>
                )}
                <Box margin="28px 0" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    onClick={onConfirm}
                    sx={{ height: 60, width: 300 }}
                    disabled={!!amount && tokens.length !== amount}
                  >
                    {tokens.length === amount
                      ? `${tokens.length}/${amount} Confirm`
                      : amount === 0
                      ? `${tokens.length} NFTs has been chosen`
                      : `${amount} NFTs should be chosen`}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ minHeight: 290, width: '100%' }}>
            {loading || poolLoading ? (
              <Box width={'100%'} display="flex" mt={20} alignItems="center" justifyContent="center">
                <Loader />
              </Box>
            ) : (
              <Grid container spacing={6} width="100%">
                {searchIdToken === null && (
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
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

function NftCard({
  token,
  onClick,
  disabled,
  selected = false
}: {
  token: Token721
  onClick: () => void
  disabled: boolean
  selected?: boolean
}) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <Box
      onClick={disabled ? undefined : onClick}
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
        opacity: disabled ? 0.8 : 1,
        '&:hover': disabled
          ? {}
          : {
              boxShadow: isDarkMode ? 'none' : '0px 3px 10px rgba(0, 0, 0, 0.15)',
              background: isDarkMode ? '#2E3133' : '#FFFFFF',
              cursor: 'pointer'
            }
      }}
    >
      <Box sx={{ width: '100%', height: 120, overflow: 'hidden' }}>
        <LogoBase
          srcs={token?.uri ? [token.uri] : []}
          alt={token.name ?? ''}
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
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
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        <span style={{ color: theme.palette.text.secondary }}>balance: </span> 1
      </Typography>
    </Box>
  )
}
