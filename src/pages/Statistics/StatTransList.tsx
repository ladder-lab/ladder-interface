import { ChainId } from '@ladder/sdk'
import { StatTransactionsProp, StatTransactionsType, useTransactionsList } from '../../hooks/useStatBacked'
import { Box, Link, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import StatTable, { TableHeadCellsProp, TableRowCellsProp } from './StatTable'
import { formatMillion, getEtherscanLink, shortenAddress } from '../../utils'
import RowBetween from '../../styled/RowBetween'
import { useMemo } from 'react'
import { Mode } from '../../components/Input/CurrencyInputPanel/SelectCurrencyModal'

export function StatTransList({
  chainId,
  token,
  pair,
  tokenType
}: {
  chainId: ChainId
  token?: string
  pair?: string
  tokenType?: Mode
}) {
  const { result, page, order, loading, search } = useTransactionsList({ chainId, token, tokenType, pair })
  const theme = useTheme()

  const headers: TableHeadCellsProp[] = [
    {
      label: (
        <Stack spacing={16} direction={'row'}>
          {Object.values(StatTransactionsType).map(item => (
            <Typography
              sx={{
                cursor: 'pointer',
                opacity: item === search.type ? 1 : 0.6
              }}
              onClick={() => search.setType(item)}
              key={item}
            >
              {item}
            </Typography>
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
          <ShowTransactionsSwapName item={item} />
        ) : (
          <ShowTransactionsLiquidityName item={item} />
        )
    },
    { label: `${formatMillion(Number(item.totalValue), '$ ', 2)}` },
    {
      label: (
        <Box display={'flex'} justifyContent="center" alignItems={'center'}>
          {`${formatMillion(Number(item.buyAmount), '', 4)}`} {item.buyToken.symbol}
        </Box>
      )
    },
    {
      label: (
        <Box display={'flex'} justifyContent="center" alignItems={'center'}>
          {`${formatMillion(Number(item.sellAmount), '', 4)}`} {item.sellToken.symbol}
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

function ShowTransactionsSwapName({ item }: { item: StatTransactionsProp }) {
  return (
    <Link href={getEtherscanLink(item.chainId, item.hash, 'transaction')} target="_blank" underline="hover">
      Swap {item.sellToken.symbol} for {item.buyToken.symbol}
    </Link>
  )
}

function ShowTransactionsLiquidityName({ item }: { item: StatTransactionsProp }) {
  if (item.type === StatTransactionsType.ADDS) {
    return (
      <Link href={getEtherscanLink(item.chainId, item.hash, 'transaction')} target="_blank" underline="hover">
        Add Liquidity {item.buyToken.symbol} / {item.sellToken.symbol}
      </Link>
    )
  }
  return (
    <Link href={getEtherscanLink(item.chainId, item.hash, 'transaction')} target="_blank" underline="hover">
      Remove Liquidity {item.buyToken.symbol} / {item.sellToken.symbol}
    </Link>
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
