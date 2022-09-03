import { MutableRefObject, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Grid, Box, Typography, useTheme, Button, ButtonBase, IconButton } from '@mui/material'
import Image from 'components/Image'
import SampleNftImg from 'assets/images/sample-nft.png'
import { Token1155 } from 'constants/token/token1155'
import { AllTokens } from 'models/allTokens'
import { shortenAddress } from 'utils'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { Currency } from '@uniswap/sdk'
import { useToken1155Balance, useToken1155Balances } from 'state/wallet/hooks'
import { Loader } from 'components/AnimatedSvg/Loader'
import Divider from 'components/Divider'
import { CollectionListComponent, Collection } from './ListComponent'
import LogoText from 'components/LogoText'
import { ExternalLink } from 'theme/components'
import { ReactComponent as Xcircle } from 'assets/svg/xcircle.svg'

export default function ERC721List({
  onSelectCurrency,
  searchToken,
  searchTokenIsAdded,
  currencyOptions,
  children,
  commonCollectionList,
  onSelectCollection,
  selectedCollection,
  collectionOptions,
  fixedListRef,
  selectedCurrencies
}: {
  selectedCurrencies: Currency[]
  currencyOptions: Token1155[]
  searchToken?: Token1155 | null | undefined
  searchTokenIsAdded?: boolean
  onSelectCurrency?: (token: AllTokens) => void
  children?: React.ReactNode
  commonCollectionList?: Collection[]
  onSelectCollection?: (collection: Collection) => void
  selectedCollection?: Collection | null
  collectionOptions?: Collection[]
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}) {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')
  const { balances, loading } = useToken1155Balances(currencyOptions)
  const sortedList = useMemo(() => {
    return balances?.sort((amount1, amount2) => {
      return amount1.greaterThan(amount2) ? -1 : 1
    })
  }, [balances])

  return (
    <>
      {children}
      {selectedCurrencies && (
        <Box width="100%" mt={28}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Typography>Collection:</Typography>
            <Box
              sx={{
                borderRadius: '8px',
                background: theme => theme.palette.background.default,
                padding: '11px 23px'
              }}
            >
              SelectedCollectionTitle
            </Box>
          </Box>
          {selectedCurrencies.map(currency => (
            <Box key={currency.symbol} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <LogoText logo={SampleNftImg} text={currency.name} />
              <ExternalLink href={'#'}>address.....</ExternalLink>
              <Typography>Quantity: 1</Typography>
              <IconButton onClick={() => {}}>
                <Xcircle />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
      <Box display="flex" gap={20} margin="20px 0">
        {!selectedCollection ? (
          commonCollectionList?.map((collection: Collection) => (
            <ButtonBase
              onClick={() => onSelectCollection && onSelectCollection(collection)}
              key={collection.title}
              sx={{
                borderRadius: '8px',
                background: theme => theme.palette.background.default,
                padding: '11px 23px',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              {collection.title}
            </ButtonBase>
          ))
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Typography>Collection:</Typography>
            <Box
              sx={{
                borderRadius: '8px',
                background: theme => theme.palette.background.default,
                padding: '11px 23px'
              }}
            >
              {selectedCollection.title}
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {collectionOptions && !selectedCollection && (
        <Box height={isDownMd ? 290 : 450} paddingTop={'24px'} position="relative">
          <CollectionListComponent onSelect={() => {}} options={collectionOptions} fixedListRef={fixedListRef} />
        </Box>
      )}

      {selectedCollection && (
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
                onSelectCurrency && onSelectCurrency(searchToken)
                hideModal()
              }}
            />
          ) : currencyOptions.length === 0 ? (
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
                <Button variant="text" sx={{ display: 'inline', width: 'unset', padding: 0, height: 'max-content' }}>
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
                      token={token as Token1155}
                      onClick={() => {
                        onSelectCurrency && onSelectCurrency(token)
                      }}
                    />
                  </Grid>
                ))}
            </>
          )}
        </Grid>
      )}
    </>
  )
}

function NftCard({ token, onClick }: { token: Token1155; onClick: () => void }) {
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
