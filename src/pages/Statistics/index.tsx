import { ChainId } from '@ladder/sdk'
import { Box, useTheme, styled, Typography, Stack, Popper, ClickAwayListener, Divider } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
// import { StyledPollingDot } from 'components/essential/Polling'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { routes } from 'constants/routes'
import { useTopPoolsList, useSearchTokenInfo, StatTokenInfo, StatTopPoolsProp } from 'hooks/useStatBacked'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsDarkMode } from 'state/user/hooks'
import { isAddress, scrollToElement } from 'utils'
import Input from 'components/Input'
import { Loader } from 'components/AnimatedSvg/Loader'
import { useActiveWeb3React } from 'hooks'
import RowBetween from '../../styled/RowBetween'
import { StatTransList } from './StatTransList'
import { TopPoolsList } from './TopPoolsList'
import { ShowTopTokensCurrencyBox, TopTokensList } from './TopTokensList'

const StyledTabText = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  cursor: 'pointer',
  ['&.active']: {
    color: theme.palette.common.white,
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#1F9898'
  }
}))

export const StyledTabButtonText = styled(Box)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.background.paper,
  padding: '6px 24px',
  borderRadius: '15px',
  textTransform: 'uppercase',
  marginRight: 8,
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

export enum PoolPairType {
  ERC20_ERC721 = 'ERC20 - ERC721',
  ERC20_ERC1155 = 'ERC20 - ERC1155',
  ERC20_ERC20 = 'ERC20 - ERC20'
}

export default function Statistics() {
  const { chainId } = useActiveWeb3React()
  const curChainId = useMemo(() => chainId || ChainId.SEPOLIA, [chainId])
  const isDarkMode = useIsDarkMode()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const [searchText, setSearchText] = useState('')
  const open = Boolean(anchorEl)
  const popperId = open ? 'simple-popper' : undefined

  const theme = useTheme()
  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1300px',
            padding: { sm: 0, xs: '0 15px' },
            margin: 'auto'
          }}
        >
          <RowBetween padding="20px 24px">
            <RowBetween width={'100%'} flexWrap={'wrap'}>
              <Stack direction={'row'} spacing={24} alignItems="center">
                <StyledTabText className="active" onClick={() => scrollToElement('Overview')}>
                  Overview
                </StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopTokens')}>Tokens</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopPools')}>Pools</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('Transactions')}>Transactions</StyledTabText>
              </Stack>

              {open && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                    background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
                  }}
                ></Box>
              )}
              <Box display={'flex'} alignItems="center" sx={{ mt: { sm: 0, xs: 15 } }}>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <Box ml={10}>
                    <Input
                      value={searchText}
                      height="40px"
                      placeholder="Contract Address"
                      onChange={e => setSearchText(e.target.value)}
                      aria-describedby={popperId}
                      onClick={handleClick}
                    />
                    <Popper
                      placement="bottom-end"
                      id={popperId}
                      open={open}
                      anchorEl={anchorEl}
                      sx={{
                        zIndex: theme.zIndex.tooltip,
                        width: '100%',
                        maxWidth: 400
                      }}
                    >
                      <SearchBox searchText={searchText} chainId={curChainId} />
                    </Popper>
                  </Box>
                </ClickAwayListener>
              </Box>
            </RowBetween>
          </RowBetween>
        </Box>
      </Box>

      <Stack
        spacing={28}
        sx={{
          width: '100%',
          padding: { sm: 30, xs: '20px 15px' },
          maxWidth: '1144px',
          margin: '30px auto 80px'
        }}
      >
        {/* <OverviewData chainId={curChainId} /> */}

        <TopTokensList chainId={curChainId} />

        <TopPoolsList chainId={curChainId} />

        <StatTransList chainId={curChainId} />
      </Stack>
    </Box>
  )
}

export function ShowTopPoolsCurrencyBox({
  token0Info,
  token1Info,
  fontSize,
  fontWeight,
  pair,
  color,
  chainId
}: {
  token0Info: StatTokenInfo
  token1Info: StatTokenInfo
  pair: string
  chainId: ChainId
  fontSize?: number
  fontWeight?: number
  color?: string
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      display={'flex'}
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        navigate(`${routes.statisticsPools}/${chainId}/${pair}`)
      }}
    >
      <CurrencyLogo
        size={fontSize ? fontSize + 'px' : '24px'}
        logoUrl={token0Info.logo}
        currencySymbol={token0Info.symbol}
      />
      <CurrencyLogo
        size={fontSize ? fontSize + 'px' : '24px'}
        style={{ marginLeft: -8 }}
        logoUrl={token1Info.logo}
        currencySymbol={token1Info.symbol}
      />
      {token0Info.symbol.length > 4 ? (
        <Typography
          noWrap
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          {token0Info.symbol}
        </Typography>
      ) : (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          {token0Info.symbol}
        </Typography>
      )}
      {token0Info.type === Mode.ERC1155 && (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          #{token0Info.tokenId}
        </Typography>
      )}
      <Typography
        noWrap
        fontSize={fontSize ? fontSize : 14}
        fontWeight={fontWeight ? fontWeight : 400}
        color={color || theme.palette.text.primary}
      >
        /{token1Info.symbol}
      </Typography>
      {token1Info.type === Mode.ERC1155 && (
        <Typography
          fontSize={fontSize ? fontSize : 14}
          fontWeight={fontWeight ? fontWeight : 400}
          color={color || theme.palette.text.primary}
          ml={8}
        >
          #{token1Info.tokenId}
        </Typography>
      )}
    </Box>
  )
}

function SearchBox({ searchText, chainId }: { searchText: string; chainId: ChainId }) {
  const theme = useTheme()
  const searchAddress = isAddress(searchText) ? searchText : ''
  const { result: searchTokenInfo, loading } = useSearchTokenInfo(chainId, searchAddress)

  return (
    <Box
      sx={{
        border: 1,
        p: '20px',
        borderColor: theme.palette.primary.main,
        borderRadius: '8px',
        minHeight: 100,
        bgcolor: 'background.paper'
      }}
    >
      {!searchText.trim() ? (
        <Typography textAlign={'center'}>Input token or pair address search.</Typography>
      ) : !searchAddress ? (
        <Typography textAlign={'center'}>Invalid address.</Typography>
      ) : loading ? (
        <Loader />
      ) : searchTokenInfo.is1155Token ? (
        <Stack spacing={12}>
          <Stack>
            <Typography mb={10} fontSize={18} fontWeight={500}>
              Tokens
            </Typography>
            <Box display={'flex'} alignItems="center">
              <CurrencyLogo logoUrl={searchTokenInfo.tokens[0].logo} />
              <Box ml={8}>
                <Typography>
                  {searchTokenInfo.tokens[0].name || '-'}{' '}
                  {searchTokenInfo.tokens[0].type === Mode.ERC1155 ? '#' + searchTokenInfo.tokens[0].tokenId : ''}
                </Typography>
                <Typography textAlign={'left'}>{searchTokenInfo.tokens[0].symbol}</Typography>
              </Box>
            </Box>
          </Stack>
          <Divider />
          <Typography>You are searching for token ERC1155, you can enter the id to search pool.</Typography>
          <SearchToken1155 chainId={chainId} token={searchAddress} defaultPools={searchTokenInfo.pools} />
        </Stack>
      ) : (
        <Stack spacing={12}>
          <Stack spacing={10}>
            <Typography mb={10} fontSize={18} fontWeight={500}>
              Tokens
            </Typography>
            {searchTokenInfo.tokens.length === 0 && (
              <Typography color={theme.palette.text.secondary}>No Data</Typography>
            )}
            {searchTokenInfo.tokens.map(item => (
              <ShowTopTokensCurrencyBox key={item.address + item.tokenId} chainId={chainId} tokenInfo={item} />
            ))}
          </Stack>
          <Divider />
          <Box>
            <Typography mb={10} fontSize={18} fontWeight={500}>
              Pools
            </Typography>
            {!searchTokenInfo.pools.length && <Typography color={theme.palette.text.secondary}>No Data</Typography>}
            <Stack spacing={10}>
              {searchTokenInfo.pools.map(item => (
                <ShowTopPoolsCurrencyBox
                  key={item.pair}
                  chainId={chainId}
                  pair={item.pair}
                  token0Info={item.token0}
                  token1Info={item.token1}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  )
}

function SearchToken1155({
  chainId,
  defaultPools,
  token
}: {
  chainId: ChainId
  token: string
  defaultPools: StatTopPoolsProp[]
}) {
  const theme = useTheme()
  const [token1155Id, setToken1155Id] = useState('')
  const pools = useTopPoolsList(
    token1155Id ? chainId : undefined,
    token,
    PoolPairType.ERC20_ERC1155,
    Number(token1155Id)
  )

  return (
    <Stack spacing={10}>
      <Input height={44} value={token1155Id} onChange={e => setToken1155Id(e.target.value)} />
      <Typography mb={10} fontSize={18} fontWeight={500}>
        Pools
      </Typography>
      {token1155Id !== '' ? (
        <>
          {!pools.result.length && <Typography color={theme.palette.text.secondary}>No Data</Typography>}
          <Stack spacing={10}>
            {pools.result.map(item => (
              <ShowTopPoolsCurrencyBox
                key={item.pair}
                chainId={chainId}
                pair={item.pair}
                token0Info={item.token0}
                token1Info={item.token1}
              />
            ))}
          </Stack>
        </>
      ) : (
        <>
          {!defaultPools.length && <Typography color={theme.palette.text.secondary}>No Data</Typography>}
          <Stack spacing={10}>
            {defaultPools.map(item => (
              <ShowTopPoolsCurrencyBox
                key={item.pair}
                chainId={chainId}
                pair={item.pair}
                token0Info={item.token0}
                token1Info={item.token1}
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  )
}
