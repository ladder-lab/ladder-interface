import { ChainId } from '@ladder/sdk'
import { Box, Breadcrumbs, Stack, Typography, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { usePoolDetailData } from 'hooks/useStatBacked'
import { useNavigate, useParams } from 'react-router-dom'
import { ShowTopPoolsCurrencyBox, StatTransList } from '..'

export default function Pools() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { pair, chainId } = useParams<{
    chainId: string
    pair: string
  }>()
  const curChainId = Number(chainId) as ChainId
  const { result: poolDetailData } = usePoolDetailData(curChainId, pair as string)

  return (
    <Box
      sx={{
        padding: { sm: 30, xs: '20px 15px' },
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto'
      }}
    >
      <Stack spacing={30}>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(routes.statistics)}
            fontWeight={500}
            color={theme.palette.text.primary}
          >
            Statistics
          </Typography>
          {poolDetailData && (
            <ShowTopPoolsCurrencyBox
              token0Info={poolDetailData.token0}
              token1Info={poolDetailData.token1}
              chainId={curChainId}
              pair={pair || ''}
            />
          )}
        </Breadcrumbs>

        <Box pt={22} pb={10}>
          {poolDetailData && (
            <ShowTopPoolsCurrencyBox
              token0Info={poolDetailData.token0}
              token1Info={poolDetailData.token1}
              chainId={curChainId}
              pair={pair || ''}
              fontSize={32}
              fontWeight={500}
            />
          )}
        </Box>

        <StatTransList chainId={curChainId} pair={pair} />
      </Stack>
    </Box>
  )
}
