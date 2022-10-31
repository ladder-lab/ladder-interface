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
        pt: 30,
        pb: 30,
        width: '100%',
        maxWidth: '1300px',
        margin: 'auto'
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
            Home
          </Typography>
          <Typography fontWeight={500} color={theme.palette.text.primary}>
            Pools
          </Typography>
          {poolDetailData ? (
            <ShowTopPoolsCurrencyBox
              token0Info={{ type: poolDetailData.pair.token0Type, address: poolDetailData.pair.token0Address }}
              token1Info={{ type: poolDetailData.pair.token1Type, address: poolDetailData.pair.token1Address }}
              chainId={curChainId}
              pair={poolDetailData.pair.pair}
              tokenId={poolDetailData.pair.tokenId}
            />
          ) : (
            '-'
          )}
        </Breadcrumbs>

        <Box pt={22} pb={10}>
          {poolDetailData && (
            <ShowTopPoolsCurrencyBox
              fontSize={32}
              fontWeight={500}
              token0Info={{ type: poolDetailData.pair.token0Type, address: poolDetailData.pair.token0Address }}
              token1Info={{ type: poolDetailData.pair.token1Type, address: poolDetailData.pair.token1Address }}
              chainId={curChainId}
              pair={poolDetailData.pair.pair}
              tokenId={poolDetailData.pair.tokenId}
            />
          )}
        </Box>

        <StatTransList chainId={curChainId} />
      </Stack>
    </Box>
  )
}
