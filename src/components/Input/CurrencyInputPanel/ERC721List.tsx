import { ChangeEvent, useCallback, useState, KeyboardEvent, useMemo, useEffect } from 'react'
// import { FixedSizeList } from 'react-window'
import { Box, Typography, useTheme, Button, ButtonBase, IconButton } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { isAddress, shortenAddress } from 'utils'
// import useModal from 'hooks/useModal'
import { useAddUserToken, useIsDarkMode } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { Loader } from 'components/AnimatedSvg/Loader'
// import Divider from 'components/Divider'
import { CollectionListComponent } from './ListComponent'
import LogoText from 'components/LogoText'
import { ExternalLink } from 'theme/components'
import { ReactComponent as Xcircle } from 'assets/svg/xcircle.svg'
import { ReactComponent as XcircleSm } from 'assets/svg/xcirclesm.svg'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ReactComponent as ExternalIcon } from 'assets/svg/external_arrow.svg'
import useModal from 'hooks/useModal'
import useERC721Tokens from 'hooks/useERC721'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'

// TOOD: Update to ERC721
import { Token721 } from 'constants/token/token721'
import Stepper from 'components/Stepper'
import Input from '..'
import { useIsUserAddedToken721, useToken721 } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import { filterTokens } from 'utils/swap/filtering'
import { Token } from '@ladder/sdk'
import { useToken721Balance, useToken721BalanceTokens } from 'state/wallet/hooks'

export default function ERC721List({
  onSelectCurrency,
  onSelectSubTokens
}: {
  onSelectCurrency?: (token: Token721) => void
  onSelectSubTokens?: (tokens: Token721[]) => void
}) {
  const [searchQueryNFT, setSearchQueryNFT] = useState<string>('')
  const [collection, setCollection] = useState<Token721 | null>(null)
  const { tokens, tokenOptions, commonCollections, onAddToken, onRemoveToken, onClearTokens } = useERC721Tokens({
    collection
  })

  // TODO: Update to ERC721
  // const { balances, loading } = useToken1155Balances(tokenOptions)
  // const sortedList = useMemo(() => {
  //   return balances?.sort((amount1, amount2) => {
  //     return amount1.greaterThan(amount2) ? -1 : 1
  //   })
  // }, [balances])

  const isDownMd = useBreakpoint('md')
  const { hideModal } = useModal()
  const debouncedQueryNFT = useDebounce(searchQueryNFT, 200)
  const searchTokenNFT = useToken721(debouncedQueryNFT)
  const searchTokenIsAddedNFT = useIsUserAddedToken721(searchTokenNFT)
  const addUserToken = useAddUserToken()

  const balance = useToken721Balance(collection)
  const { loading, availableTokens } = useToken721BalanceTokens(balance)

  const filteredTokens: Token[] | Token721[] = useMemo(() => {
    return filterTokens(Object.values(tokenOptions), debouncedQueryNFT)
  }, [debouncedQueryNFT, tokenOptions])

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQueryNFT(checksummedInput || input)
  }, [])

  const onSelectCollection = useCallback((collection: Token721) => {
    setCollection(collection)
  }, [])

  const onRemoveCollection = useCallback(() => {
    setCollection(null)
    onClearTokens()
  }, [onClearTokens])

  const onConfirm = useCallback(() => {
    if (!collection) {
      return
    }
    onSelectCurrency && onSelectCurrency(collection)
    onSelectSubTokens && onSelectSubTokens(tokens)
    hideModal()
  }, [collection, hideModal, onSelectCurrency, onSelectSubTokens, tokens])

  const handleEnter721 = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredTokens.length > 0) {
        }
      }
    },
    [filteredTokens.length]
  )

  useEffect(() => {
    if (!searchTokenIsAddedNFT && searchTokenNFT) {
      addUserToken(searchTokenNFT)
    }
  }, [addUserToken, searchTokenIsAddedNFT, searchTokenNFT])

  return (
    <>
      <Box margin="-24px 30px 30px">
        <Stepper
          steps={[1, 2]}
          activeStep={collection ? 1 : 0}
          onStep={(num: number) => {
            if (num !== 0) return
            setCollection(null)
          }}
          stepsDescription={['Select collection', 'Select token ID']}
        />
      </Box>

      <Input
        value={searchQueryNFT}
        onChange={handleInput}
        placeholder="Search name or paste address"
        // outlined
        startAdornment={<SearchIcon />}
        onKeyDown={handleEnter721}
        height={isDownMd ? 48 : 60}
      />

      <Box sx={{ overflow: 'auto', height: isDownMd ? 357 : 500 }}>
        {!collection ? (
          <>
            {filteredTokens.length > 0 && (
              <Box display="flex" gap={20} margin="20px 0">
                {commonCollections.map((collection: Token721, idx) => (
                  <ButtonBase
                    onClick={() => onSelectCollection(collection)}
                    key={`collection-${idx}`}
                    sx={{
                      borderRadius: '8px',
                      background: theme => theme.palette.background.default,
                      padding: '11px 23px',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    {collection.name}
                  </ButtonBase>
                ))}
              </Box>
            )}
            <Box paddingTop={'24px'} position="relative">
              {filteredTokens.length === 0 ? (
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
              ) : (
                <CollectionListComponent onSelect={onSelectCollection} options={filteredTokens as Token721[]} />
              )}
            </Box>
          </>
        ) : (
          <Box margin="20px 0" display="grid" gap={20}>
            <Box>
              {tokens.length > 0 && (
                <Box width="100%" mt={28}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 12, mb: 24 }}>
                    <Typography>Collection:</Typography>
                    <Box
                      sx={{
                        borderRadius: '8px',
                        background: theme => theme.palette.background.default,
                        padding: '11px 18px',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        height: 52
                      }}
                    >
                      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                        {collection?.name} <ExternalIcon />
                      </Typography>
                      <XcircleSm onClick={onRemoveCollection} style={{ cursor: 'pointer' }} />
                    </Box>
                  </Box>
                  {tokens.map((token, idx) => (
                    <Box
                      key={`${token.symbol}-${idx}`}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <LogoText logo={<CurrencyLogo currency={token} />} text={token.name} fontSize={12} />
                      <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
                        {token.address}
                      </ExternalLink>
                      <Typography sx={{ fontSize: 12 }}>Quantity: 1</Typography>
                      <IconButton onClick={() => onRemoveToken(token)}>
                        <Xcircle />
                      </IconButton>
                    </Box>
                  ))}
                  <Box margin="28px 0" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button onClick={onConfirm} sx={{ height: 60, width: 300 }}>
                      Confirm
                    </Button>
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Typography>Collection:</Typography>
                <Box
                  sx={{
                    borderRadius: '8px',
                    background: theme => theme.palette.background.default,
                    padding: '11px 23px'
                  }}
                >
                  {collection.name}
                </Box>
                <ExternalLink href={'#'} showIcon sx={{ fontSize: 12 }}>
                  {shortenAddress(collection.address)}
                </ExternalLink>
              </Box>
            </Box>
            <Box spacing={20} sx={{ overflow: 'auto', minHeight: 290 }} position="relative">
              {loading ? (
                <Box width={'100%'} display="flex" mt={20} alignItems="center" justifyContent="center">
                  <Loader />
                </Box>
              ) : (
                <Box
                  display="grid"
                  gridTemplateColumns={'repeat(auto-fit, 140px)'}
                  width="100%"
                  gap={10}
                  justifyContent="center"
                >
                  {availableTokens?.map(token => (
                    <NftCard
                      key={token.tokenId}
                      token={token}
                      onClick={() => {
                        onAddToken(token)
                      }}
                    />
                  ))}
                </Box>
              )}
              {/* {searchToken && !searchTokenIsAdded ? (
                <NftCard
                  token={searchToken}
                  onClick={() => {
                    onAddToken(searchToken)
                  }}
                />
              ) : tokenOptions.length === 0 ? (
                <Box width={'100%'} display="flex" alignItems="center" justifyContent="center">
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
                    No results found. &nbsp;
                    <Button
                      variant="text"
                      sx={{ display: 'inline', width: 'unset', padding: 0, height: 'max-content' }}
                    >
                      Import token
                    </Button>
                  </Typography>
                </Box>
              ) : (
                <>
                  {loading && (
                    <Box width={'100%'} display="flex" alignItems="center" justifyContent="center">
                      <Loader />
                    </Box>
                  )}
                  {!loading &&
                    sortedList?.map(({ token }, idx) => (
                      <Grid item xs={6} md={3} key={idx}>
                        <NftCard
                          key={idx}
                          token={token as Token721}
                          onClick={() => {
                            onAddToken(token as Token721)
                          }}
                        />
                      </Grid>
                    ))}
                </>
              )} */}
            </Box>
          </Box>
        )}
      </Box>
    </>
  )
}

function NftCard({ token, onClick }: { token: Token721; onClick: () => void }) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        alignItems: 'center',
        borderRadius: '8px',
        background: isDarkMode ? '#15171A' : '#F6F6F6',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: isDarkMode ? 'none' : '0px 3px 10px rgba(0, 0, 0, 0.15)',
          background: isDarkMode ? '#2E3133' : '#FFFFFF',
          cursor: 'pointer'
        }
      }}
    >
      <Image src={token?.uri ?? SampleNftImg} style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }} />
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
      {/* <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address) ?? ''}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        <span style={{ color: theme.palette.text.secondary }}>balance: </span> 1
      </Typography> */}
    </Box>
  )
}
