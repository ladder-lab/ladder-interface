import { Typography, Box, useTheme } from '@mui/material'
import { AllTokens } from 'models/allTokens'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import Tag from 'components/Tag'
import { getTokenText } from 'utils/checkIs1155'

export default function PosittionCard({
  assetA,
  assetB,
  lpBalance,
  error,
  color,
  poolShare,
  liquidityA,
  liquidityB
}: {
  assetA?: AllTokens
  assetB?: AllTokens
  error?: string
  color?: string
  lpBalance?: string
  poolShare?: string
  liquidityA?: string
  liquidityB?: string
}) {
  const theme = useTheme()
  const { token1Text, token2Text } = getTokenText(assetA, assetB)
  const data = {
    ['Your pool share']: poolShare ?? '-' + ' %',
    [token1Text ?? '-']: liquidityA ?? '-',
    [token2Text ?? '']: liquidityB ?? '-'
  }
  return (
    <>
      <Card
        color={error ? theme.palette.action.disabledBackground : color ? color : theme.palette.background.default}
        style={{
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
              <DoubleCurrencyLogo currency0={assetA} currency1={assetB} />
              <Typography fontSize={16} fontWeight={700}>
                {lpBalance || '-'}{' '}
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
