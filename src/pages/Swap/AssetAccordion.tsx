import { useMemo } from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import Accordion from 'components/Accordion'
import { useCallback, useState } from 'react'
import { AllTokens } from 'models/allTokens'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import Tag from 'components/Tag'
import { checkIs1155 } from 'utils/checkIs1155'
import Copy from 'components/essential/Copy'
import SampleNftImg from 'assets/images/sample-nft.png'
import LogoText from 'components/LogoText'
import { ExternalLink } from 'theme/components'
import { Token721 } from 'models/allTokens'

export function AssetAccordion({
  token,
  disabled,
  subTokens
}: {
  token?: AllTokens
  disabled?: boolean
  subTokens?: Token721[]
}) {
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()

  const handleChange = useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  const is1155 = checkIs1155(token)

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
          <Typography
            color={theme.palette.text.secondary}
            component="div"
            sx={{ wordWrap: 'break-word', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}
          >
            Contract:{' '}
            {token && 'address' in token ? (
              <>
                <Typography sx={{ wordWrap: 'break-word', maxWidth: '100%' }}>{token?.address}</Typography>
                <Copy toCopy={token?.address} />
              </>
            ) : (
              '-'
            )}
          </Typography>
          {is1155 && (
            <Typography color={theme.palette.text.secondary} sx={{ wordWrap: 'break-word' }}>
              Token Id: {token && 'tokenId' in token ? token.tokenId : 'none'}
            </Typography>
          )}
        </Box>

        <Tag sx={{ position: 'absolute', right: 0, top: 0 }}>{is1155 ? 'ERC1155' : 'ERC20'}</Tag>
      </Box>
    )
  }, [token, theme.palette.text.secondary, is1155])

  const details = useMemo(() => {
    return (
      <Box sx={{ display: 'grid', gap: 12, pt: 12 }}>
        {subTokens &&
          subTokens.length > 0 &&
          subTokens.map((token, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <LogoText logo={SampleNftImg} text={token.name} />
              <ExternalLink sx={{ color: theme.palette.text.secondary }} href={'#'} showIcon>
                {token.address}
              </ExternalLink>
              <Typography sx={{ color: theme.palette.text.secondary }}>Quantity: 1</Typography>
            </Box>
          ))}
      </Box>
    )
  }, [subTokens])

  return (
    <Accordion
      summary={summary}
      details={details}
      expanded={expanded}
      onChange={handleChange}
      margin={'0'}
      disabled={disabled}
      iconCssOverride={{ right: 0, bottom: 0, position: 'absolute' }}
    />
  )
}
