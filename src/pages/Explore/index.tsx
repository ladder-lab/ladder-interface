import { Box, useTheme, IconButton, styled } from '@mui/material'
import { ReactComponent as Twitter } from 'assets/svg/socials/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/socials/discord.svg'
import { ReactComponent as Website } from 'assets/svg/socials/website.svg'
import { ExternalLink } from 'theme/components'
import { ExternalLinks } from 'constants/external_links'

export default function Explore() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
        backgroundSize: '100% 100%'
      }}
    >
      <SocilaMediaGroup />
    </Box>
  )
}

const SocilaMediaBtn = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRadius: 8,
  width: 44,
  height: 44,
  '&:hover': {
    opacity: 0.8
  }
}))

function SocilaMediaGroup() {
  return (
    <Box sx={{ display: 'flex', gap: 20 }}>
      <ExternalLink href={ExternalLinks.twitter}>
        <SocilaMediaBtn>
          <Twitter />
        </SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.discord}>
        <SocilaMediaBtn>
          <Discord />
        </SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.website}>
        <SocilaMediaBtn>
          <Website />
        </SocilaMediaBtn>
      </ExternalLink>
    </Box>
  )
}
