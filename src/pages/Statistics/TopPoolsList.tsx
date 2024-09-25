import { ChainId } from '@ladder/sdk'
import { GraphOrderType, useTopPoolsList } from '../../hooks/useStatBacked'
import { Box, Typography, useTheme } from '@mui/material'
import StatTable, { TableHeadCellsProp, TableRowCellsProp } from './StatTable'
import { Mode } from '../../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { formatMillion } from '../../utils'
import RowBetween from '../../styled/RowBetween'
import { PoolPairType, ShowTopPoolsCurrencyBox } from './index'

export function TopPoolsList({
  chainId,
  token,
  token1155Id,
  defaultPoolPairType
}: {
  chainId: ChainId
  token?: string
  defaultPoolPairType?: PoolPairType | undefined | null
  token1155Id?: number
}) {
  const { result, page, order, loading } = useTopPoolsList({
    chainId,
    token,
    poolPairType: defaultPoolPairType || PoolPairType.ERC20_ERC721,
    token1155Id
  })
  const theme = useTheme()
  const headers: TableHeadCellsProp[] = [
    {
      label: '#'
    },
    { label: 'Name', align: 'left' },
    { label: 'Price' },
    { label: 'TVL', sortValue: GraphOrderType.TVL, sort: true },
    { label: 'Volume 24H' },
    { label: 'Volume 7D' }
  ]
  const rows: TableRowCellsProp[][] = result.map((item, index) => [
    { label: page.pageSize * (page.currentPage - 1) + 1 + index },
    {
      label: (
        <ShowTopPoolsCurrencyBox
          chainId={chainId}
          pair={item.pair || item.id}
          token0Info={item.token0}
          token1Info={item.token1}
        />
      )
    },
    {
      label: (
        <Typography>
          {/* {item.token0?.price ? formatMillion(Number(item.token0.price), '$', 4) : '-'}/
          {item.token1?.price ? formatMillion(Number(item.token1.price), '$', 4) : '-'} */}
          {[Mode.ERC1155, Mode.ERC721].includes(item.token0.type)
            ? formatMillion(Number(item.token0?.price || 0), '$', 4)
            : formatMillion(Number(item.token1?.price || 0), '$', 4)}
        </Typography>
      )
    },
    { label: `${formatMillion(Number(item.tvl), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.Volume), '$ ', 2)}` },
    { label: `${formatMillion(Number(item.Volume7), '$ ', 2)}` }
  ])

  return (
    <Box id="TopPools">
      <RowBetween mb={18}>
        <RowBetween flexWrap="wrap">
          <Typography fontWeight={500} fontSize={16} color={theme.palette.text.primary} mr={16}>
            {token ? 'Top Pairs' : 'Top Pools'}
          </Typography>
        </RowBetween>
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
