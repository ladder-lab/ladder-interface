import { useState, useCallback, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  styled as muiStyled,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
// import SwitchToggle from 'components/SwitchToggle'
import { useDarkModeManager } from 'state/user/hooks'
import MainLogo from 'components/MainLogo'
import useBreakpoint from 'hooks/useBreakpoint'
// import { ReactComponent as AboutIcon } from 'assets/svg/menu/about.svg'
// import { ReactComponent as HelpCenterIcon } from 'assets/svg/menu/help_center.svg'
// import { ReactComponent as RequestFeatureIcon } from 'assets/svg/menu/request_feature.svg'
import { ReactComponent as DiscordIcon } from 'assets/svg/menu/discord.svg'
// import { ReactComponent as LanguageIcon } from 'assets/svg/menu/language.svg'
import { ReactComponent as DarkThemeIcon } from 'assets/svg/menu/dark_theme.svg'
// import { ReactComponent as DocsIcon } from 'assets/svg/menu/docs.svg'
// import { ReactComponent as LegalPrivacyIcon } from 'assets/svg/menu/legal_privacy.svg'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  {
    title: 'Event',
    route: routes.testnet
  },
  // {
  //   title: 'Airdop',
  //   route: routes.airdrop
  // },
  { title: 'Swap', route: routes.swap },
  { title: 'Pool', route: routes.pool },
  { title: 'Explore', route: routes.explorer },
  { title: 'Statistics', route: routes.statistics }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(Link)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 40px 0 25px!important',
  zIndex: theme.zIndex.drawer,
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.text.primary,
    opacity: 0.5,
    marginRight: 48,
    paddingBottom: '30px',
    borderBottom: '2px solid transparent',
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.text.primary
    },
    '&:hover': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px !important'
  },
  [theme.breakpoints.down('md')]: {},
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  height: theme.height.header,
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 60,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isDownMd = useBreakpoint('md')
  const navigate = useNavigate()
  const [darkMode] = useDarkModeManager()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const toHome = useCallback(() => navigate(routes.swap), [navigate])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Box
          display="flex"
          alignItems="center"
          gap={30}
          onClick={toHome}
          sx={{
            ':hover': {
              cursor: 'pointer'
            }
          }}
        >
          <MainLogo color={darkMode ? '#FFFFFF' : '#232859'} />
          {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}> */}
          {/* <SwitchToggle checked={darkMode} onChange={toggleDarkMode} /> */}
          {/* <Typography color="#cccccc">Dark mode</Typography> */}
          {/* </Box> */}
        </Box>

        <HideOnMobile breakpoint="md">
          <LinksWrapper>
            {Tabs.map(({ title, route, subTab, link, titleContent }, idx) => {
              console.log(pathname, title, pathname === '/round3' && title === 'Event')
              return subTab ? (
                <Box
                  sx={{
                    marginRight: {
                      xs: 15,
                      lg: 48
                    },
                    height: 'auto',
                    paddingBottom: '30px',
                    borderBottom: '2px solid transparent',
                    borderColor: theme =>
                      subTab.some(tab => tab.route && pathname.includes(tab.route))
                        ? theme.palette.text.primary
                        : 'transparnet',
                    display: 'inline'
                  }}
                  key={title + idx}
                >
                  <PlainSelect
                    key={title + idx}
                    placeholder={title}
                    autoFocus={false}
                    width={title === 'Test' ? '70px' : undefined}
                    style={{
                      height: '16px'
                    }}
                  >
                    {subTab.map((sub, idx) =>
                      sub.link ? (
                        <MenuItem
                          onClick={() => setMenuOpen(false)}
                          key={sub.link + idx}
                          sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                          selected={false}
                        >
                          <ExternalLink
                            href={sub.link}
                            className={'link'}
                            color="#00000050"
                            sx={{
                              '&:hover': {
                                color: '#232323!important'
                              }
                            }}
                          >
                            {sub.titleContent ?? sub.title}
                          </ExternalLink>
                        </MenuItem>
                      ) : (
                        <MenuItem key={sub.title + idx} onClick={() => setMenuOpen(false)}>
                          <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                        </MenuItem>
                      )
                    )}
                  </PlainSelect>
                </Box>
              ) : link ? (
                <ExternalLink
                  href={link}
                  className={'link'}
                  key={link + idx}
                  style={{ fontSize: 14, pointerEvents: 'none' }}
                >
                  {titleContent ?? title}
                </ExternalLink>
              ) : (
                <Link
                  onClick={() => setMenuOpen(false)}
                  key={title + idx}
                  id={`${route}-nav-link`}
                  to={route ?? ''}
                  className={
                    (route
                      ? pathname.includes(route)
                        ? 'active'
                        : pathname.includes('account') && route.includes('account')
                        ? 'active'
                        : (pathname.includes('/round') ||
                            pathname.includes('/airdrop') ||
                            pathname.includes('/monopoly')) &&
                          title.includes('Event')
                        ? 'active'
                        : ''
                      : '') + ' link'
                  }
                >
                  {titleContent ?? title}
                </Link>
              )
            })}
          </LinksWrapper>
        </HideOnMobile>

        <Box display="flex" alignItems="center" gap={{ xs: '8px', sm: '20px' }}>
          <NetworkSelect />
          <Web3Status />
          <Box sx={{ position: 'relative' }}>
            <MenuButton
              onClick={() => {
                isDownMd ? setMobileMenuOpen(open => !open) : setMenuOpen(open => !open)
              }}
            />
            {menuOpen && !isDownMd && <DesktopMenu />}
          </Box>
        </Box>
      </StyledAppBar>
    </>
  )
}

function MenuButton({ onClick }: { onClick: () => void }) {
  const theme = useTheme()

  return (
    <IconButton
      sx={{
        height: 46,
        width: 46,
        padding: '4px',
        borderRadius: '8px',
        background: theme => theme.palette.background.default
      }}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 10.7825H7"
          stroke={theme.palette.text.primary}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 6H3"
          stroke={theme.palette.text.primary}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 15.5652H3"
          stroke={theme.palette.text.primary}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 20.3479H7"
          stroke={theme.palette.text.primary}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  )
}

export function DesktopMenu() {
  const theme = useTheme()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const options = useMemo(() => {
    return [
      // { title: 'About', link: 'https://www.ladder.top/about', icon: <AboutIcon /> },
      // { title: 'Help Center', link: '#', icon: <HelpCenterIcon /> },
      // { title: 'Request Features', link: '#', icon: <RequestFeatureIcon /> },
      { title: 'Discord', link: 'https://discord.gg/KWgkFMt9qZ', icon: <DiscordIcon /> },
      // { title: 'Language', link: '#', icon: <LanguageIcon /> },
      { title: darkMode ? 'LightMode' : 'Dark Theme', action: toggleDarkMode, icon: <DarkThemeIcon /> }
      // { title: 'Docs', link: '#', icon: <DocsIcon /> },
      // { title: 'Legal & Privacy', link: 'https://github.com/ladder-lab/core', icon: <LegalPrivacyIcon /> }
    ]
  }, [darkMode, toggleDarkMode])

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        borderRadius: '10px',
        width: { sx: '100%', sm: 180 },
        position: { sx: 'unset', sm: 'absolute' },
        right: 0,
        top: '87px',
        padding: '10px 0'
      }}
    >
      {options.map(({ title, link, action, icon }) => {
        return link ? (
          <MenuItem key={title} sx={{ height: 33 }}>
            <ExternalLink href={link} sx={{ width: '100%', height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" height="100%" width="100%">
                <Typography color={theme.palette.text.primary}>{title}</Typography>
                {icon}
              </Box>
            </ExternalLink>
          </MenuItem>
        ) : action ? (
          <MenuItem key={title} sx={{ height: 33 }}>
            <ButtonBase onClick={action} sx={{ width: '100%', height: '100%', padding: 0 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" height="100%" width="100%">
                <Typography color={theme.palette.text.primary}>{title}</Typography>
                {icon}
              </Box>
            </ButtonBase>
          </MenuItem>
        ) : undefined
      })}
    </Box>
  )
}
