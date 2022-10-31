import { ChainId, Token } from '@ladder/sdk'
import { Box, useTheme, styled, Typography, Stack, Tooltip, Link } from '@mui/material'
import AreaChart from 'components/Chart'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { StyledPollingDot } from 'components/essential/Polling'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { TEST_1155_LIST } from 'constants/default1155List'
import { routes } from 'constants/routes'
import { Token1155 } from 'constants/token/token1155'
import { Token721 } from 'constants/token/token721'
import { useAllTokens, useToken } from 'hooks/Tokens'
import {
  useTopTokensList,
  useTopPoolsList,
  useTransactionsList,
  StatTransactionsType,
  StatTransactionsProp,
  useStatisticsOverviewData
} from 'hooks/useStatBacked'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrackedToken1155List, useTrackedToken721List } from 'state/user/hooks'
import { formatMillion, getEtherscanLink, scrollToElement, shortenAddress, timeStampToFormat } from 'utils'
import StatTable, { TableHeadCellsProp, TableRowCellsProp } from './StatTable'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

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

const StyledTabButtonText = styled(Box)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.background.paper,
  padding: '6px 16px',
  borderRadius: '15px',
  textTransform: 'uppercase',
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

export enum PoolPairType {
  ERC20_ERC20 = 'ERC20 - ERC20',
  ERC20_ERC1155 = 'ERC20 - ERC1155',
  ERC20_ERC721 = 'ERC20 - ERC721'
}

export default function Statistics() {
  const curChainId = ChainId.GÖRLI
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
            margin: 'auto'
          }}
        >
          <RowBetween padding="12px 0">
            <Box display={'flex'} alignItems="center">
              <Box
                display={'flex'}
                sx={{
                  padding: '6px 12px',
                  backgroundColor: theme.color.color3,
                  borderRadius: '8px',
                  mr: 12
                }}
              >
                <Typography fontSize={12} fontWeight={500} color={theme.palette.text.secondary}>
                  Latest synced block:
                </Typography>
                <Typography ml={6} fontSize={12} fontWeight={500} color="#27AE60">
                  15095147{' '}
                </Typography>
                <StyledPollingDot />
              </Box>
              <Typography ml={16}>ETH Price: $1.18k</Typography>
            </Box>
          </RowBetween>
          <RowBetween padding="20px 0">
            <RowBetween>
              <Stack direction={'row'} spacing={24} alignItems="center">
                <StyledTabText className="active" onClick={() => scrollToElement('Overview')}>
                  Overview
                </StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopTokens')}>Tokens</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('TopPools')}>Pools</StyledTabText>
                <StyledTabText onClick={() => scrollToElement('Transactions')}>Transactions</StyledTabText>
              </Stack>
            </RowBetween>
          </RowBetween>
        </Box>
      </Box>

      <Stack
        spacing={28}
        sx={{
          width: '100%',
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

export function OverviewData({ chainId }: { chainId: ChainId }) {
  const { TVLTotal, result, volumeTotal } = useStatisticsOverviewData(chainId)
  const tvlData = useMemo(() => {
    return result
      .filter((_, i) => i === 0)
      .map(item => ({ time: timeStampToFormat(item.timestamp), value: Number(item.tvl) }))
  }, [result])

  const volumeData = useMemo(() => {
    return result
      .filter((_, i) => i === 0)
      .map(item => ({ time: timeStampToFormat(item.timestamp), value: Number(item.volume) }))
  }, [result])

  const theme = useTheme()
  return (
    <Box id="Overview">
      <Typography mb={16} fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
        LADDER Overview
      </Typography>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: '1fr 1fr',
          gap: 20
        }}
      >
        <Box
          padding="20px"
          sx={{
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Stack>
            <Typography fontSize={16}>TVL</Typography>
            <Typography fontSize={32} fontWeight={600}>
              {formatMillion(TVLTotal, '$', 2)}
            </Typography>
          </Stack>
          <AreaChart id="transaction-tvl" unit="$" height={200} areaSeriesData={tvlData} />
        </Box>
        <Box
          padding="20px"
          sx={{
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Stack>
            <Typography fontSize={16}>Volume 24H</Typography>
            <Typography fontSize={32} fontWeight={600}>
              {formatMillion(volumeTotal, '$', 2)}
            </Typography>
          </Stack>
          <AreaChart id="transaction-volume" unit="$" height={200} areaSeriesData={volumeData} />
        </Box>
      </Box>
    </Box>
  )
}

function TopTokensList({ chainId }: { chainId: ChainId }) {
  const { search: topTokensSearch, result, page, order, loading } = useTopTokensList(chainId)
  const theme = useTheme()

  const headers: TableHeadCellsProp[] = [
    {
      label: '#'
    },
    { label: 'Name', sortValue: 'Name', align: 'left' },
    { label: 'Price', sortValue: 'Price' },
    // { label: 'Price Change', sortValue: 'Price Change' },
    { label: 'Volume 24H', sortValue: 'Volume' },
    { label: 'TVL', sortValue: 'TVL', sort: true }
  ]
  const rows: TableRowCellsProp[][] = result.map((item, index) => [
    { label: page.pageSize * (page.currentPage - 1) + 1 + index },
    {
      label: (
        <ShowTopTokensCurrencyBox
          type={topTokensSearch.type}
          chainId={chainId}
          address={item.token}
          token1155Id={item.tokenId}
        />
      )
    },
    { label: `${formatMillion(Number(item.price), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.Volume), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.tvl), '$ ', 2)}` }
  ])

  return (
    <Box id="TopTokens">
      <RowBetween mb={18}>
        <Stack direction={'row'} spacing={8} alignItems="center">
          <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
            Top Tokens
          </Typography>
          {Object.values(Mode).map(item => (
            <StyledTabButtonText
              key={item}
              className={item === topTokensSearch.type ? 'active' : ''}
              onClick={() => topTokensSearch.setType(item)}
            >
              {item}
            </StyledTabButtonText>
          ))}
        </Stack>
        <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary}>
          Explore
        </Typography>
      </RowBetween>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px'
        }}
      >
        <StatTable
          headers={headers}
          loading={loading}
          rows={rows}
          page={page.currentPage}
          setPage={page.setCurrentPage}
          count={page.count}
          {...order}
          pageSize={page.pageSize}
        />
      </Box>
    </Box>
  )
}

export function TopPoolsList({
  chainId,
  token,
  supportPoolPairTypes
}: {
  chainId: ChainId
  token?: string
  supportPoolPairTypes?: PoolPairType[]
}) {
  const {
    search: poolsSearch,
    result,
    page,
    order,
    loading
  } = useTopPoolsList(chainId, token, supportPoolPairTypes?.[0] || PoolPairType.ERC20_ERC20)
  const theme = useTheme()

  const headers: TableHeadCellsProp[] = [
    {
      label: '#'
    },
    { label: 'Name', sortValue: 'Name', align: 'left' },
    { label: 'TVL', sortValue: 'TVL', sort: true },
    { label: 'Volume 24H', sortValue: 'Volume' },
    { label: 'Volume 7D', sortValue: 'Volume 7D' }
  ]
  const rows: TableRowCellsProp[][] = result.map((item, index) => [
    { label: page.pageSize * (page.currentPage - 1) + 1 + index },
    {
      label: (
        <ShowTopPoolsCurrencyBox
          chainId={chainId}
          pair={item.pair}
          tokenId={item.tokenId}
          token0Info={{
            address: item.token0,
            type: item.token0Type
          }}
          token1Info={{
            address: item.token1,
            type: item.token1Type
          }}
        />
      )
    },
    { label: `${formatMillion(Number(item.tvl), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.Volume), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.Volume7), '$ ', 2)}` }
  ])

  return (
    <Box id="TopPools">
      <RowBetween mb={18}>
        <Stack direction={'row'} spacing={8} alignItems="center">
          <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
            {token ? 'Top Pairs' : 'Top Pools'}
          </Typography>
          {(supportPoolPairTypes || Object.values(PoolPairType)).map(item => (
            <StyledTabButtonText
              key={item}
              className={item === poolsSearch.type ? 'active' : ''}
              onClick={() => poolsSearch.setType(item)}
            >
              {item}
            </StyledTabButtonText>
          ))}
        </Stack>
        {!token && (
          <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary}>
            Explore
          </Typography>
        )}
      </RowBetween>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px'
        }}
      >
        <StatTable
          headers={headers}
          loading={loading}
          rows={rows}
          page={page.currentPage}
          setPage={page.setCurrentPage}
          count={page.count}
          {...order}
          pageSize={page.pageSize}
        />
      </Box>
    </Box>
  )
}

export function StatTransList({ chainId, token }: { chainId: ChainId; token?: string }) {
  const { result, page, order, loading } = useTransactionsList(chainId, token)
  const theme = useTheme()

  const headers: TableHeadCellsProp[] = [
    {
      label: (
        <Stack spacing={16} direction={'row'}>
          {Object.values(StatTransactionsType)
            .filter(item => item === 'Swaps')
            .map(item => (
              <Typography key={item}>{item}</Typography>
            ))}
        </Stack>
      )
    },
    { label: 'Total Value' },
    { label: 'Token Amount' },
    { label: 'Token Amount' },
    { label: 'Account' },
    { label: 'Time', sortValue: 'Time', sort: true }
  ]
  const rows: TableRowCellsProp[][] = result.map(item => [
    {
      label:
        item.type === StatTransactionsType.SWAPS ? (
          <ShowTransactionsSwapName chainId={chainId} item={item} />
        ) : (
          <ShowTransactionsLiquidityName chainId={chainId} item={item} />
        )
    },
    { label: `${formatMillion(Number(item.totalValue), '$ ', 2)}` },
    {
      label: (
        <Box display={'flex'} justifyContent="center" alignItems={'center'}>
          {`${formatMillion(Number(item.buyAmount), '', 4)}`}{' '}
          <ShowTokenSymbol chainId={chainId} address={item.buyToken} type={item.buyTokenType} />
        </Box>
      )
    },
    {
      label: (
        <Box display={'flex'} justifyContent="center" alignItems={'center'}>
          {`${formatMillion(Number(item.sellAmount), '', 4)}`}{' '}
          <ShowTokenSymbol chainId={chainId} address={item.sellToken} type={item.sellTokenType} />
        </Box>
      )
    },
    {
      label: (
        <Link href={getEtherscanLink(chainId, item.account, 'address')} target="_blank" underline="hover">
          {shortenAddress(item.account)}
        </Link>
      )
    },
    { label: <ShowTime timeStamp={Number(item.timestamp)} showTime /> }
  ])

  return (
    <Box id="Transactions">
      <RowBetween mb={18}>
        <Stack direction={'row'} spacing={8} alignItems="center">
          <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={8}>
            Transactions
          </Typography>
        </Stack>
      </RowBetween>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px'
        }}
      >
        <StatTable
          headers={headers}
          loading={loading}
          rows={rows}
          page={page.currentPage}
          setPage={page.setCurrentPage}
          count={page.count}
          {...order}
          pageSize={page.pageSize}
        />
      </Box>
    </Box>
  )
}

function ShowTime({ timeStamp, showTime }: { timeStamp: number; showTime?: boolean }) {
  const str = useMemo(() => {
    const now = Math.ceil(new Date().getTime() / 1000)
    const gap = now - timeStamp
    if (gap < 0) {
      return '0 secs ago'
    }
    if (gap < 60) {
      return `${gap} secs ago`
    }
    if (gap < 3600) {
      return `${Number(gap / 60).toFixed()} mins ago`
    }
    if (gap < 3600 * 24) {
      return `${Number(gap / 3600).toFixed()} hrs ago`
    }
    return `${Number(gap / 86400).toFixed()} days ago`
  }, [timeStamp])

  if (showTime) {
    return (
      <Tooltip title={new Date(timeStamp * 1000).toLocaleString()} arrow placement="top">
        <span>{str}</span>
      </Tooltip>
    )
  }
  return <>{str}</>
}

export function useGetLocalToken(
  type: Mode,
  chainId: ChainId,
  address: string,
  token1155Id?: number
): Token | Token1155 | Token721 | undefined {
  const allTokens = useAllTokens()
  const allToken1155 = useTrackedToken1155List()
  const tokenOptions = useTrackedToken721List()
  const erc20Token = useToken(Mode.ERC20 === type ? address : '')

  return useMemo(() => {
    if (erc20Token) return erc20Token
    if (Mode.ERC20 === type) {
      for (const token of Object.values(allTokens)) {
        if (token.chainId === chainId && token.address.toLowerCase() === address.toLowerCase()) {
          return token
        }
      }
    }
    if (Mode.ERC1155 === type) {
      for (const token of allToken1155) {
        if (token.chainId === chainId && chainId === 5 && token.address.toLowerCase() === address.toLowerCase()) {
          if (!token1155Id) {
            return token
          }
          const _token = TEST_1155_LIST.filter(i => i.address.toLowerCase() === token.address.toLowerCase())[0]
          return new Token1155(chainId, token.address, token1155Id, {
            name: _token.name,
            symbol: _token.symbol,
            uri: _token.uri
          })
        }
      }
    }
    if (Mode.ERC721 === type) {
      for (const token of tokenOptions) {
        if (token.chainId === chainId && token.address.toLowerCase() === address.toLowerCase()) {
          return token
        }
      }
    }
    return undefined
  }, [address, allToken1155, allTokens, chainId, erc20Token, token1155Id, tokenOptions, type])
}

function ShowTopTokensCurrencyBox({
  type,
  chainId,
  address,
  token1155Id
}: {
  type: Mode
  chainId: ChainId
  address: string
  token1155Id: number | undefined
}) {
  const token = useGetLocalToken(type, chainId, address)
  const navigate = useNavigate()

  return (
    <Link
      display={'flex'}
      // href={getEtherscanLink(chainId, address, 'token')}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        navigate(
          routes.statisticsTokens +
            `/${type}/${chainId}/${address}` +
            (type === Mode.ERC1155 ? `/${token1155Id}` : '/0')
        )
      }}
      target="_blank"
      underline="hover"
    >
      <CurrencyLogo currency={token} />
      <Box ml={8}>
        <Typography>
          {token?.name || '-'} {type === Mode.ERC1155 ? '#' + token1155Id : ''}
        </Typography>
        <Typography textAlign={'left'}>{token?.symbol}</Typography>
      </Box>
    </Link>
  )
}

export function ShowTopPoolsCurrencyBox({
  token0Info,
  token1Info,
  tokenId,
  fontSize,
  fontWeight,
  pair,
  chainId
}: {
  token0Info: {
    type: Mode
    address: string
  }
  token1Info: {
    type: Mode
    address: string
  }
  tokenId: number
  pair: string
  chainId: ChainId
  fontSize?: number
  fontWeight?: number
}) {
  const theme = useTheme()
  const token0 = useGetLocalToken(token0Info.type, chainId, token0Info.address)
  const token1 = useGetLocalToken(token1Info.type, chainId, token1Info.address)

  const sortTokens = useMemo(() => {
    if (!token0 || !token1) {
      return [token0, token1]
    }
    if (token0Info.type === Mode.ERC20) {
      if (token0Info.type === Mode.ERC20 && token1Info.type === Mode.ERC20) {
        return token0.sortsBefore(token1) ? [token0, token1] : [token1, token0]
      }
      return [token0, token1]
    }
    return [token1, token0]
  }, [token0, token0Info.type, token1, token1Info.type])
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
      <CurrencyLogo size={fontSize ? fontSize + 'px' : '24px'} currency={sortTokens[0]} />
      <CurrencyLogo size={fontSize ? fontSize + 'px' : '24px'} style={{ marginLeft: -8 }} currency={sortTokens[1]} />
      <Typography fontSize={fontSize} fontWeight={fontWeight} color={theme.palette.text.primary} ml={8}>
        {sortTokens[0]?.symbol || '-'}/
      </Typography>
      <Typography fontSize={fontSize} fontWeight={fontWeight} color={theme.palette.text.primary}>
        {sortTokens[1]?.symbol || '-'}
      </Typography>
      {(token0Info.type === Mode.ERC1155 || token1Info.type === Mode.ERC1155) && (
        <Typography fontSize={fontSize} fontWeight={fontWeight} color={theme.palette.text.primary} ml={8}>
          #{tokenId}
        </Typography>
      )}
    </Box>
  )
}

function ShowTransactionsSwapName({ item, chainId }: { chainId: ChainId; item: StatTransactionsProp }) {
  const buyToken = useGetLocalToken(item.buyTokenType, chainId, item.buyToken)
  const sellToken = useGetLocalToken(item.sellTokenType, chainId, item.sellToken)

  return (
    <Link href={getEtherscanLink(chainId, item.hash, 'transaction')} target="_blank" underline="hover">
      Swap {buyToken?.symbol || '--'} for {sellToken?.symbol || '--'}
    </Link>
  )
}

function ShowTransactionsLiquidityName({ item, chainId }: { chainId: ChainId; item: StatTransactionsProp }) {
  if (item.type === StatTransactionsType.ADDS) {
    return (
      <Link href={getEtherscanLink(chainId, item.hash, 'transaction')} target="_blank" underline="hover">
        Add Liquidity
      </Link>
    )
  }
  return (
    <Link href={getEtherscanLink(chainId, item.hash, 'transaction')} target="_blank" underline="hover">
      Remove Liquidity
    </Link>
  )
}

function ShowTokenSymbol({ type, chainId, address }: { type: Mode; chainId: ChainId; address: string }) {
  const token = useGetLocalToken(type, chainId, address)

  return <>{token?.symbol}</>
}
