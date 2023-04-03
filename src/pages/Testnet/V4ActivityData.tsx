import { Box, useTheme, Typography } from '@mui/material'
import QuestionHelper from 'components/essential/QuestionHelper'
import { ChainId } from 'constants/chain'
import { useV3ActivityData } from 'hooks/useTestnetV3'
import { useMemo } from 'react'
import { formatMillion } from 'utils'
import { Row } from '../MyAccount/OrigAccount'

export default function V3ActivityData() {
  const curChainId = ChainId.SEPOLIA
  const theme = useTheme()
  const v3ActivityData = useV3ActivityData(curChainId)

  const data = useMemo(
    () => [
      {
        name: 'TVL',
        helperText: 'Total Value Locked',
        value: v3ActivityData ? formatMillion(v3ActivityData.tvl, '$ ', 2) : '-'
      },
      {
        name: 'Assets',
        helperText: 'Equity Value of NFT and Token',
        value: v3ActivityData ? formatMillion(v3ActivityData.assets, '$ ', 2) : '-'
      },
      {
        name: 'Transactions',
        helperText: 'Total Swap Count',
        value: v3ActivityData ? v3ActivityData.transfers : '-'
      }
    ],
    [v3ActivityData]
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
              padding: '6px'
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '24px',
                borderRadius: '16px'
              }}
            >
              <Box>
                <Typography color={theme.palette.text.primary} fontSize={16} component="div" mb={16}>
                  <Row>
                    {item.name} <QuestionHelper style={{ marginLeft: 5 }} text={item.helperText} />
                  </Row>
                </Typography>
                <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
