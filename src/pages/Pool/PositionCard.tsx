import { Typography, Box, useTheme } from '@mui/material'
import { AllTokens } from 'models/allTokens'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import Tag from 'components/Tag'
import { checkTokenType, getTokenText } from 'utils/checkIs1155'
import { useActiveWeb3React } from 'hooks'

export default function PositionCard({
  assetA,
  assetB,
  lpBalance,
  error,
  color,
  poolShare,
  liquidityA,
  liquidityB
}: {
  assetA?: AllTokens | null
  assetB?: AllTokens | null
  error?: string | JSX.Element
  color?: string
  lpBalance?: string
  poolShare?: string
  liquidityA?: string
  liquidityB?: string
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { token1Text, token2Text } = getTokenText(chainId, assetA ?? undefined, assetB ?? undefined)
  const data = {
    ['Your pool share']: poolShare ?? '-' + ' %',
    [`${token1Text ?? '-'} in pool`]: liquidityA ?? '-',
    [`${token2Text ?? ''} in pool`]: liquidityB ?? '-'
  }
  return (
    <>
      <Card
        color={error ? theme.palette.action.disabledBackground : color ? color : theme.palette.background.paper}
        style={{
          padding: '16px 20px',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {error && (
          <Typography component="div" fontSize={16} fontWeight={500} color={theme.palette.text.secondary}>
            {error}
          </Typography>
        )}
        {!error && (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Pool position</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {assetA && <Tag>{checkTokenType(assetA)}</Tag>}
                {assetB && <Tag>{checkTokenType(assetB)}</Tag>}
              </Box>
            </Box>

            <Box
              display={{ xs: 'grid', sm: 'flex' }}
              justifyContent="space-between"
              mt={22}
              mb={28}
              alignItems="center"
              gap={4}
            >
              <Box display={{ xs: 'grid', sm: 'flex' }} gap={15} alignItems="center">
                <DoubleCurrencyLogo currency0={assetA ?? undefined} currency1={assetB ?? undefined} size={24} />
                <Typography fontWeight={500} fontSize={16}>
                  {token1Text + '/' + token2Text}
                </Typography>
              </Box>
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
