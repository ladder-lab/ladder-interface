import { Typography, Box, styled, useTheme } from '@mui/material'
import Image from 'components/Image'
import Accordion from 'components/Accordion'

export function AssetAccordion({
  logo,
  name,
  contract,
  tokenId,
  tokenType,
  expanded,
  onChange
}: {
  logo: string
  name: string
  contract: string
  tokenId?: string
  tokenType?: string
  expanded: boolean
  onChange: () => void
}) {
  const theme = useTheme()

  const Tag = styled(Box)({
    borderRadius: '10px',
    boxShadow: '0px 3px 10px rgba(0,0,0,0.15 )',
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 12,
    padding: '4px 12px'
  })

  const summary = (
    <Box sx={{ display: 'flex', gap: 19, alignItems: 'center' }}>
      <Image src={logo} style={{ width: 36 }} />
      <Box display="grid" gap={8}>
        <Typography color={theme.palette.text.secondary}>Name: {name}</Typography>
        <Typography color={theme.palette.text.secondary}>Contract: {contract}</Typography>
        <Typography color={theme.palette.text.secondary}>Token Id: {tokenId || 'none'}</Typography>
      </Box>

      <Tag>{tokenType}</Tag>
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
      onChange={onChange}
      iconCssOverride={{ right: 0, bottom: 0, position: 'absolute' }}
    />
  )
}
