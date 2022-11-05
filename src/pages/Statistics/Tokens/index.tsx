import { ChainId } from '@ladder/sdk'
import { Box, Breadcrumbs, Stack, Typography, useTheme } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { routes } from 'constants/routes'
import { useTokenDetailData } from 'hooks/useStatBacked'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { shortenAddress } from 'utils'
import { PoolPairType, StatTransList, TopPoolsList } from '..'

export default function Tokens() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { type, chainId, address, token1155Id } = useParams<{
    type: Mode
    chainId: string
    address: string
    token1155Id: string
  }>()
  const curChainId = Number(chainId) as ChainId
  const { result: tokenDetailData } = useTokenDetailData(
    curChainId,
    address || '',
    type || Mode.ERC20,
    Number(token1155Id)
  )

  const supportPoolPairTypes = useMemo(() => {
    if (type === Mode.ERC721) {
      return [PoolPairType.ERC20_ERC721]
    }
    if (type === Mode.ERC1155) {
      return [PoolPairType.ERC20_ERC1155]
    }
    return undefined
  }, [type])

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
            Tokens
          </Typography>
          <Box display={'flex'} alignItems="center">
            <Typography fontWeight={500} color={theme.palette.text.primary}>
              {tokenDetailData?.symbol || '--'}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.text.secondary}>
              ({tokenDetailData ? shortenAddress(tokenDetailData.address) : ''})
            </Typography>
          </Box>
        </Breadcrumbs>

        <Box pt={22} pb={10}>
          <Box display={'flex'} alignItems="center">
            <CurrencyLogo size="32px" logoUrl={tokenDetailData?.logo}></CurrencyLogo>
            <Typography ml={8} fontWeight={500} fontSize={32} color={theme.palette.text.primary}>
              {tokenDetailData?.name || '-'}({tokenDetailData?.symbol}){' '}
              {token1155Id && type === Mode.ERC1155 ? `#${token1155Id}` : ''}
            </Typography>
          </Box>
        </Box>

        <TopPoolsList
          supportPoolPairTypes={[]}
          defaultPoolPairType={supportPoolPairTypes?.[0] || PoolPairType.ERC20_ERC20}
          chainId={curChainId}
          token={address}
          token1155Id={Number(token1155Id)}
        />

        <StatTransList chainId={curChainId} token={address} />
      </Stack>
    </Box>
  )
}
