import { Typography, Box, useTheme } from '@mui/material'
import { AllTokens } from 'models/allTokens'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import Tag from 'components/Tag'

export default function PosittionCard({
  from,
  to,
  price,
  error
}: {
  from?: AllTokens
  to?: AllTokens
  price?: string
  error?: string
}) {
  const theme = useTheme()
  const data = {
    ['Your pool share']: '5.00 %',
    ['DAI']: '0.2344887737787377',
    ['Tickets for the community #56']: '30'
  }
  return (
    <>
      {!error && (
        <Typography sx={{ textAlign: 'center', mt: 20, color: theme.palette.text.secondary }}>Pool Found!</Typography>
      )}
      <Card
        color={error ? theme.palette.action.disabledBackground : theme.palette.background.default}
        style={{
          margin: error ? '20px 0 40px' : '8px 0 40px',
          padding: '16px 20px',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {error && <Typography>{error}</Typography>}
        {!error && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 12 }}>
              <Typography sx={{ fontSize: 20 }}>Your position</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Tag>ERC20</Tag>
                <Tag>ERC1155</Tag>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={28}>
              <DoubleCurrencyLogo currency0={from} currency1={to} />
              <Typography fontSize={16} fontWeight={700}>
                {price || '-'}{' '}
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gap: 12 }}>
              {Object.keys(data).map((key, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between">
                  <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>{key}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{data[key as keyof typeof data]}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Card>
    </>
  )
}
