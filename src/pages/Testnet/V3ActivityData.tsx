import { Box, useTheme, styled, Typography } from '@mui/material'
import RankingImg from 'assets/images/testv2_user_ranking.png'
import QuestionHelper from 'components/essential/QuestionHelper'
import { ChainId } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useAccountTestInfo } from 'hooks/useTestnetV2'
import { useMemo } from 'react'
import { formatMillion } from 'utils'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

export default function V3ActivityData() {
  const curChainId = ChainId.SEPOLIA
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const accountTestInfo = useAccountTestInfo(curChainId, account || undefined)
  const data = useMemo(
    () => [
      {
        name: 'TVL',
        helperText: 'Total Value Locked',
        value: accountTestInfo ? formatMillion(accountTestInfo.tvl, '$ ', 2) : '-'
      },
      {
        name: 'Assets',
        helperText: 'Equity Value of NFT and Token',
        value: accountTestInfo ? formatMillion(accountTestInfo.assets, '$ ', 2) : '-'
      },
      {
        name: 'Transactions',
        helperText: 'Total Swap Count',
        value: accountTestInfo ? accountTestInfo.transfers : '-'
      }
    ],
    [accountTestInfo]
  )

  return (
    <Box>
      <Box
        display={'grid'}
        sx={{
          gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
          mt: { md: 40, xs: 20 },
          gap: { md: '30px', xs: '20px' }
        }}
      >
        {data.map(item => (
          <Box
            key={item.name}
            sx={{
              background: `url(${RankingImg}) no-repeat`,
              padding: '6px',
              backgroundSize: '100% 100%'
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '30px 20px',
                borderRadius: '16px'
              }}
            >
              <RowBetween>
                <Typography color={theme.palette.text.secondary} fontSize={16} component="div">
                  <RowBetween>
                    {item.name} <QuestionHelper style={{ marginLeft: 5 }} text={item.helperText} />
                  </RowBetween>
                </Typography>
                <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
                  {item.value}
                </Typography>
              </RowBetween>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
