import { ChainId } from '@ladder/sdk'
import { Box, Breadcrumbs, Stack, Typography, useTheme } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { routes } from 'constants/routes'
import { Token } from 'constants/token'
import { Token1155 } from 'constants/token/token1155'
import { Token721 } from 'constants/token/token721'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { shortenAddress } from 'utils'
import { StatTransList, TopPoolsList, useGetLocalToken } from '..'

export default function Tokens() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { type, chainId, address, token1155Id } = useParams<{
    type: string
    chainId: string
    address: string
    token1155Id: string
  }>()
  const curChainId = Number(chainId) as ChainId
  const _token = useGetLocalToken(type as Mode, curChainId, address || '')
  const token = useMemo(() => {
    if (type === Mode.ERC721) return _token as Token721
    if (type === Mode.ERC1155) return _token as Token1155
    return _token as Token
  }, [_token, type])

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
              {token?.symbol || '--'}
            </Typography>
            <Typography fontWeight={500} color={theme.palette.text.secondary}>
              ({token ? shortenAddress(token.address) : ''})
            </Typography>
          </Box>
        </Breadcrumbs>

        <Box pt={22} pb={10}>
          <Box display={'flex'} alignItems="center">
            <CurrencyLogo size="32px" currency={token}></CurrencyLogo>
            <Typography ml={8} fontWeight={500} fontSize={32} color={theme.palette.text.primary}>
              {token?.name || '-'}({token?.symbol}) {token1155Id && type === Mode.ERC1155 ? `#${token1155Id}` : ''}
            </Typography>
          </Box>
        </Box>

        <TopPoolsList chainId={curChainId} token={address} />

        <StatTransList chainId={curChainId} token={address} />
      </Stack>
    </Box>
  )
}
