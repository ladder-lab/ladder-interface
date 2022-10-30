import { ChainId, Token } from '@ladder/sdk'
import { Box, useTheme, styled, Typography, Stack, Tooltip, Link } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { StyledPollingDot } from 'components/essential/Polling'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { Token1155 } from 'constants/token/token1155'
import { Token721 } from 'constants/token/token721'
import { useAllTokens, useToken } from 'hooks/Tokens'
import {
  useTopTokensList,
  useTopPoolsList,
  useTransactionsList,
  StatTransactionsType,
  StatTransactionsProp
} from 'hooks/useStatBacked'
import { useMemo } from 'react'
import { useTrackedToken1155List, useTrackedToken721List } from 'state/user/hooks'
import { formatMillion, getEtherscanLink, scrollToElement, shortenAddress } from 'utils'
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
                <StyledTabText className="active">Overview</StyledTabText>
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
        <TopTokensList chainId={curChainId} />

        <TopPoolsList chainId={curChainId} />

        <TransList chainId={curChainId} />
      </Stack>
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
    { label: <ShowTopTokensCurrencyBox type={topTokensSearch.type} chainId={chainId} address={item.token} /> },
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

function TopPoolsList({ chainId }: { chainId: ChainId }) {
  const { search: poolsSearch, result, page, order, loading } = useTopPoolsList(chainId)
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
          tokenId={item.tokenId}
          pair={item.pair}
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
            Top Pools
          </Typography>
          {Object.values(PoolPairType).map(item => (
            <StyledTabButtonText
              key={item}
              className={item === poolsSearch.type ? 'active' : ''}
              onClick={() => poolsSearch.setType(item)}
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

function TransList({ chainId }: { chainId: ChainId }) {
  const { result, page, order, loading } = useTransactionsList(chainId)
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
          {`${formatMillion(Number(item.buyAmount), '', 2)}`}{' '}
          <ShowTokenSymbol chainId={chainId} address={item.buyToken} type={item.buyTokenType} />
        </Box>
      )
    },
    {
      label: (
        <Box display={'flex'} justifyContent="center" alignItems={'center'}>
          {`${formatMillion(Number(item.sellAmount), '', 2)}`}{' '}
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

function useGetLocalToken(type: Mode, chainId: ChainId, address: string): Token | Token1155 | Token721 | undefined {
  const allTokens = useAllTokens()
  const allToken1155 = useTrackedToken1155List()
  const tokenOptions = useTrackedToken721List()
  const erc20Token = useToken(Mode.ERC20 === type ? address : '')

  return useMemo(() => {
    if (erc20Token) return erc20Token
    for (const token of Object.values(allTokens)) {
      if (token.chainId === chainId && token.address.toLowerCase() === address.toLowerCase()) {
        return token
      }
    }
    for (const token of allToken1155) {
      if (token.chainId === chainId && token.address.toLowerCase() === address.toLowerCase()) {
        return token
      }
    }
    for (const token of tokenOptions) {
      if (token.chainId === chainId && token.address.toLowerCase() === address.toLowerCase()) {
        return token
      }
    }
    return undefined
  }, [address, allToken1155, allTokens, chainId, erc20Token, tokenOptions])
}

function ShowTopTokensCurrencyBox({ type, chainId, address }: { type: Mode; chainId: ChainId; address: string }) {
  const token = useGetLocalToken(type, chainId, address)

  return (
    <Link display={'flex'} href={getEtherscanLink(chainId, address, 'token')} target="_blank" underline="hover">
      <CurrencyLogo currency={token} />
      <Box ml={8}>
        <Typography>{token?.name || '-'}</Typography>
        <Typography textAlign={'left'}>{token?.symbol}</Typography>
      </Box>
    </Link>
  )
}

function ShowTopPoolsCurrencyBox({
  token0Info,
  token1Info,
  tokenId,
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
}) {
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

  return (
    <Link
      display={'flex'}
      alignItems="center"
      href={getEtherscanLink(chainId, pair, 'token')}
      target="_blank"
      underline="hover"
    >
      <CurrencyLogo currency={sortTokens[0]} />
      <CurrencyLogo style={{ marginLeft: -8 }} currency={sortTokens[1]} />
      <Typography ml={8}>{sortTokens[0]?.symbol || '-'}/</Typography>
      <Typography>{sortTokens[1]?.symbol || '-'}</Typography>
      {(token0Info.type !== Mode.ERC20 || token1Info.type !== Mode.ERC20) && <Typography ml={8}>#{tokenId}</Typography>}
    </Link>
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
