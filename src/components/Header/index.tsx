import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Box, IconButton, MenuItem, styled as muiStyled, styled, Typography, useTheme } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import { ReactComponent as Ladder } from '../../assets/svg/ladder.svg'
import { ReactComponent as LadderLogo } from '../../assets/svg/ladder_logo.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import NetworkSelect from './NetworkSelect'
import SwitchToggle from 'components/SwitchToggle'
import { useDarkModeManager } from 'state/user/hooks'
import useBreakpoint from 'hooks/useBreakpoint'

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
  { title: 'Swap', route: routes.swap },
  { title: 'Pool', route: routes.pool },
  { title: 'Explore', link: 'https://www.google.com/' },
  { title: 'Statistics', link: '' }
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
  position: 'relative',
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
    padding: '0 24px 0 0!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(Link, { shouldForwardProp: prop => !(prop === 'isDarkMode') })<{ isDarkMode?: boolean }>(
  ({ theme, isDarkMode }) => ({
    '& svg': {
      width: 180.8,
      height: 34.7,
      fill: isDarkMode ? theme.palette.text.primary : '#232859'
    },
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.down('sm')]: {
      '& img': { width: 100, height: 'auto' },
      marginBottom: -10,
      '& svg': {
        width: 34,
        height: 40
      }
    }
  })
)

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 60,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

export default function Header() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Box display="flex" alignItems="center">
          <MainLogo id={'Ladder'} to={'/'} isDarkMode={darkMode}>
            {isDownMd ? <LadderLogo /> : <Ladder />}
          </MainLogo>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <SwitchToggle checked={darkMode} onChange={toggleDarkMode} />{' '}
            <Typography color="#cccccc">Dark mode</Typography>
          </Box>
        </Box>

        <HideOnMobile breakpoint="md">
          <LinksWrapper>
            {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
              subTab ? (
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
                        <MenuItem key={sub.title + idx}>
                          <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                        </MenuItem>
                      )
                    )}
                  </PlainSelect>
                </Box>
              ) : link ? (
                <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                  {titleContent ?? title}
                </ExternalLink>
              ) : (
                <Link
                  key={title + idx}
                  id={`${route}-nav-link`}
                  to={route ?? ''}
                  className={
                    (route
                      ? pathname.includes(route)
                        ? 'active'
                        : pathname.includes('account')
                        ? route.includes('account')
                          ? 'active'
                          : ''
                        : ''
                      : '') + ' link'
                  }
                >
                  {titleContent ?? title}
                </Link>
              )
            )}
          </LinksWrapper>
        </HideOnMobile>

        <Box display="flex" alignItems="center" gap={{ xs: '8px', sm: '20px' }}>
          <NetworkSelect />
          <Web3Status />

          <ShowOnMobile breakpoint="md">
            <IconButton
              sx={{
                height: 46,
                width: 46,
                padding: '4px',
                borderRadius: '8px',
                background: theme => theme.palette.background.default
              }}
              onClick={() => {
                setMobileMenuOpen(open => !open)
              }}
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
          </ShowOnMobile>
        </Box>
      </StyledAppBar>
    </>
  )
}
