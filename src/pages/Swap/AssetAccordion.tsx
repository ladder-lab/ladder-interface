import { Typography, Box, styled, useTheme } from '@mui/material'
import Accordion from 'components/Accordion'
import { useIsDarkMode } from 'state/user/hooks'
import { useCallback, useState } from 'react'
import { AllTokens } from 'models/allTokens'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export function AssetAccordion({ token }: { token?: AllTokens }) {
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()
  const darkMode = useIsDarkMode()

  const handleChange = useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  const Tag = styled(Box)(({ theme }) => ({
    borderRadius: '10px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.15)',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 12,
    padding: '4px 12px',
    background: darkMode ? '#484D50' : '#FFFFFF',
    color: theme.palette.primary.main
  }))

  const summary = (
    <Box sx={{ display: 'flex', gap: 19, alignItems: 'center' }}>
      <CurrencyLogo currency={token} style={{ width: 36 }} />
      <Box display="grid" gap={8}>
        <Typography color={theme.palette.text.secondary}>Name: {token?.name ?? '-'}</Typography>
        <Typography color={theme.palette.text.secondary}>
          Contract: {token && 'address' in token ? token?.address : '-'}
        </Typography>
        <Typography color={theme.palette.text.secondary}>
          Token Id: {token && 'tokenId' in token ? token.tokenId : 'none'}
        </Typography>
      </Box>

      <Tag>{token && 'is1155' in token ? 'ERC1155' : 'ERC20'}</Tag>
    </Box>
  )

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
