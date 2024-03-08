import { Box, useTheme, styled, Typography } from '@mui/material'
import RankingImg from 'assets/images/testv2_user_ranking.png'
import QuestionHelper from 'components/essential/QuestionHelper'
// import { ChainId } from 'constants/chain'
// import { useV3ActivityData } from 'hooks/useTestnetV3'
import { useMemo } from 'react'
import { formatMillion } from 'utils'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

export default function V3ActivityData() {
  // const curChainId = ChainId.SEPOLIA
  const theme = useTheme()
  // const v3ActivityData = useV3ActivityData(curChainId)

  const data = useMemo(
    () => [
      {
        name: 'TVL',
        helperText: 'Total Value Locked',
        value: formatMillion(502756.545, '$ ', 2)
        // value: v3ActivityData ? formatMillion(v3ActivityData.tvl, '$ ', 2) : '-'
      },
      {
        name: 'Assets',
        helperText: 'Equity Value of NFT and Token',
        value: formatMillion(1169628.4614, '$ ', 2)
        // value: v3ActivityData ? formatMillion(v3ActivityData, '$ ', 2) : '-'
      },
      {
        name: 'Transactions',
        helperText: 'Total Swap Count',
        value: 5761
        // value: v3ActivityData ? v3ActivityData.transfers : '-'
      }
    ],
    []
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
                <Typography color={theme.palette.text.secondary} fontSize={20} component="div">
                  <RowBetween>
                    {item.name} <QuestionHelper style={{ marginLeft: 5 }} text={item.helperText} />
                  </RowBetween>
                </Typography>
                <Typography color={theme.palette.text.primary} fontSize={32} fontWeight={600}>
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
