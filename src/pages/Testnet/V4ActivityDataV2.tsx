import { Box, useTheme, Typography } from '@mui/material'
import QuestionHelper from 'components/essential/QuestionHelper'
import { useMemo } from 'react'
import { formatMillion } from 'utils'
import { Row } from '../MyAccount/OrigAccount'
import { useActivityData } from '../../hooks/useTestnet'

export default function V4ActivityData() {
  const theme = useTheme()
  const activityData = useActivityData()
  const data = useMemo(
    () => [
      {
        name: 'TVL',
        helperText: 'Total Value Locked',
        value: activityData ? formatMillion(activityData.TVL, '$ ', 2) : '-'
      },
      {
        name: 'Trading volume',
        helperText: 'Equity Value of NFT and Token',
        value: activityData ? formatMillion(activityData.volume, '', 2) : '-'
      },
      {
        name: 'Transactions',
        helperText: 'Total Swap Count',
        value: activityData ? activityData.transactions : '-'
      }
    ],
    [activityData]
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
          <Box key={item.name}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '24px',
                borderRadius: '16px'
              }}
            >
              <Box>
                <Typography color={theme.palette.text.primary} fontSize={20} component="div" mb={16}>
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
