import { MutableRefObject, useCallback, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { Grid, Box, Typography, useTheme, Button, ButtonBase, IconButton } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { shortenAddress } from 'utils'
// import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
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
import { Token721 } from 'models/allTokens'

// TOOD: Update to ERC721
import { useToken1155Balance, useToken1155Balances } from 'state/wallet/hooks'

export default function ERC721List({
  searchToken,
  searchTokenIsAdded,
  children,
  fixedListRef,
  onSelectCurrency,
  onSelectSubTokens
}: {
  // currencyOptions: Token721[]
  searchToken?: Token721 | null | undefined
  searchTokenIsAdded?: boolean
  children?: React.ReactNode
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  onSelectCurrency?: (token: Token721) => void
  onSelectSubTokens?: (tokens: Token721[]) => void
}) {
  const { hideModal } = useModal()

  const [collection, setCollection] = useState<Token721 | null>(null)
  const { tokens, tokenOptions, commonCollections, onAddToken, onRemoveToken, onClearTokens } = useERC721Tokens({
    collection
  })

  // TODO: Update to ERC721
  const { balances, loading } = useToken1155Balances(tokenOptions)
  const sortedList = useMemo(() => {
    return balances?.sort((amount1, amount2) => {
      return amount1.greaterThan(amount2) ? -1 : 1
    })
  }, [balances])

  const isDownMd = useBreakpoint('md')

  const onSelectCollection = useCallback((collection: Token721) => {
    setCollection(collection)
    onSelectCurrency && onSelectCurrency(collection)
  }, [])

  const onRemoveCollection = useCallback(() => {
    setCollection(null)
    onClearTokens()
  }, [])

  const onConfirm = useCallback(() => {
    // Do something...
    console.log(tokens, 'current selected')
    onSelectSubTokens && onSelectSubTokens(tokens)
    hideModal()
  }, [tokens])

  return (
    <>
      {children}
      <Box sx={{ height: '480px', overflow: 'scroll' }}>
        {!collection ? (
          <>
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
            <Box height={isDownMd ? 290 : 450} paddingTop={'24px'} position="relative">
              <CollectionListComponent
                onSelect={onSelectCollection}
                options={tokenOptions}
                fixedListRef={fixedListRef}
              />
            </Box>
          </>
        ) : (
          <Box margin="20px 0">
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
                {collection.address}
              </ExternalLink>
            </Box>
            <Grid
              container
              spacing={20}
              sx={{ overflow: 'auto', height: isDownMd ? 357 : 517, pb: 100 }}
              paddingTop={'24px'}
              position="relative"
            >
              {searchToken && !searchTokenIsAdded ? (
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
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </>
  )
}

function NftCard({ token, onClick }: { token: Token721; onClick: () => void }) {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const balance = useToken1155Balance(token)

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
        {token.name}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, fontWeight: 600, mb: 8 }}>
        #{token.tokenId}
      </Typography>
      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 10, fontWeight: 400, mb: 4 }}>
        {shortenAddress(token.address)}
      </Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
        {balance?.toFixed(0)} /<span style={{ color: theme.palette.text.secondary }}>1 M</span>
      </Typography>
    </Box>
  )
}
