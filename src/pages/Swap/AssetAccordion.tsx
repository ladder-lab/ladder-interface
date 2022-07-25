import { useMemo } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import Accordion from 'components/Accordion'
import { useCallback, useState } from 'react'
import { AllTokens } from 'models/allTokens'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Tag from 'components/Tag'

export function AssetAccordion({ token }: { token?: AllTokens }) {
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()

  const handleChange = useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  const summary = useMemo(() => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row'
          },
          gap: 19,
          alignItems: {
            xs: 'flex-start',
            md: 'center'
          },
          width: '100%'
        }}
      >
        <CurrencyLogo currency={token} style={{ width: 36 }} />
        <Box display="flex" flexDirection="column" gap={8} width="100%">
          <Typography color={theme.palette.text.secondary}>Name: {token?.name ?? '-'}</Typography>
          <Typography color={theme.palette.text.secondary} sx={{ wordWrap: 'break-word' }}>
            Contract: {token && 'address' in token ? token?.address : '-'}
          </Typography>
          <Typography color={theme.palette.text.secondary} sx={{ wordWrap: 'break-word' }}>
            Token Id: {token && 'tokenId' in token ? token.tokenId : 'none'}
          </Typography>
        </Box>

        <Tag sx={{ position: 'absolute', right: 0, top: 0 }}>{token && 'is1155' in token ? 'ERC1155' : 'ERC20'}</Tag>
      </Box>
    )
  }, [token])

  const details = (
    <Box pt={12}>
      <Typography color={theme.palette.text.secondary}>Supply/Holder: 20000/500</Typography>
      {/* Graph */}
      {/* View accrued fees and analytics or NFTscan */}
    </Box>
  )

  return (
    <Accordion
      summary={summary}
      details={details}
      expanded={expanded}
      onChange={handleChange}
      margin={'0'}
      iconCssOverride={{ right: 0, bottom: 0, position: 'absolute' }}
    />
  )
}
