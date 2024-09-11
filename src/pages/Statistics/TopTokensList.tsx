import { ChainId } from '@ladder/sdk'
import { StatTokenInfo, useTopTokensList } from '../../hooks/useStatBacked'
import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import StatTable, { TableHeadCellsProp, TableRowCellsProp } from './StatTable'
import { formatMillion } from '../../utils'
import RowBetween from '../../styled/RowBetween'
import { Mode } from '../../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { StyledTabButtonText } from './index'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../constants/routes'
import CurrencyLogo from '../../components/essential/CurrencyLogo'

export function ShowTopTokensCurrencyBox({ chainId, tokenInfo }: { chainId: ChainId; tokenInfo: StatTokenInfo }) {
  const navigate = useNavigate()

  return (
    <Link
      display={'flex'}
      // href={getEtherscanLink(chainId, address, 'token')}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        navigate(
          routes.statisticsTokens +
            `/${tokenInfo.type}/${chainId}/${tokenInfo.address}` +
            (tokenInfo.type === Mode.ERC1155 ? `/${tokenInfo.tokenId}` : '/0')
        )
      }}
      target="_blank"
      underline="hover"
    >
      <CurrencyLogo logoUrl={tokenInfo.logo} currencySymbol={tokenInfo.symbol} />
      <Box ml={8}>
        <Typography textAlign={'left'}>
          {tokenInfo.name || '-'} {tokenInfo.type === Mode.ERC1155 ? '#' + tokenInfo.tokenId : ''}
        </Typography>
        <Typography textAlign={'left'}>{tokenInfo.symbol}</Typography>
      </Box>
    </Link>
  )
}

export function TopTokensList({ chainId }: { chainId: ChainId }) {
  const { search: topTokensSearch, result, page, order, loading } = useTopTokensList({ chainId })
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
      label: <ShowTopTokensCurrencyBox chainId={chainId} tokenInfo={item.token} />
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
          {[Mode.ERC721, Mode.ERC1155, Mode.ERC20].map(item => (
            <StyledTabButtonText
              key={item}
              className={item === topTokensSearch.type ? 'active' : ''}
              onClick={() => topTokensSearch.setType(item)}
            >
              {item}
            </StyledTabButtonText>
          ))}
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
