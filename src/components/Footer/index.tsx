import { Box, Button, Stack, Typography } from '@mui/material'
import { HideOnMobile } from 'theme/index'
import { ReactComponent as Medium } from 'assets/socialLinksIcon/medium.svg'
import { ReactComponent as Twitter } from 'assets/socialLinksIcon/twitter.svg'
import { ReactComponent as Telegram } from 'assets/socialLinksIcon/telegram.svg'
import { ReactComponent as Discord } from 'assets/socialLinksIcon/discord.svg'
import { ReactComponent as Logo } from 'assets/svg/footer-logo.svg'
import { ExternalLink } from 'theme/components'
import { useIsDarkMode } from '../../state/user/hooks'

export default function Footer() {
  const isDark = useIsDarkMode()
  return (
    <HideOnMobile>
      <footer
        style={{
          height: 180,
          opacity: 0.8
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          padding="60px 160px 45px 106px"
          sx={{
            background: theme => theme.palette.background.paper,
            '& svg': {
              fill: isDark ? 'white' : '#232859'
            }
          }}
        >
          <Box>
            <Logo />
            <Typography>©2023 Ladder. All rights reserved.</Typography>
          </Box>
          <Stack direction={'row'}>
            <Button variant="text">
              <ExternalLink href="https://twitter.com/Laddertop_NFT">
                <Twitter />
              </ExternalLink>
            </Button>
            <Button variant="text">
              <ExternalLink href="https://t.me/+CQuxqoqD7GIxZTY1">
                <Telegram />
              </ExternalLink>
            </Button>
            <Button variant="text">
              <ExternalLink href="https://discord.com/invite/FjXpN8wYBq">
                <Discord />
              </ExternalLink>
            </Button>
            <Button variant="text">
              <ExternalLink href="https://medium.com/@ladder_top">
                <Medium />
              </ExternalLink>
            </Button>
          </Stack>
        </Box>
      </footer>
    </HideOnMobile>
  )
}
