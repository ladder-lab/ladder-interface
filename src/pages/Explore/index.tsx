import { Box, useTheme, IconButton, styled, Typography } from '@mui/material'
import { ReactComponent as Twitter } from 'assets/svg/socials/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/socials/discord.svg'
import { ReactComponent as Website } from 'assets/svg/socials/website.svg'
import { ExternalLink } from 'theme/components'
import { ExternalLinks } from 'constants/external_links'
import Card from 'components/Card'

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
      <Box sx={{ padding: '60px 45px', display: 'flex', gap: 32 }}>
        <Box sx={{ width: 724 }}>
          <SocilaMediaGroup />
          <Typography variant="h1" sx={{ mt: 40 }}>
            Incredible liquidity pool! Quickly find real-time value of NFTs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 20, mt: 48 }}>
            <Card padding="28px 24px" light width={320}>
              <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700 }}>
                $1,732,654,325
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 400, mt: 16, color: theme.palette.text.secondary }}>
                Total Liquidity
              </Typography>
            </Card>
            <Card padding="28px 24px" light width={320}>
              <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700 }}>
                $1,732,654,325
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 400, mt: 16, color: theme.palette.text.secondary }}>
                Volume(24hrs)
              </Typography>
            </Card>
          </Box>
        </Box>
      </Box>
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
