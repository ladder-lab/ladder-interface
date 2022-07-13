import { createTheme, styled, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useIsDarkMode } from 'state/user/hooks'

interface Gradient {
  gradient1: string
  gradient2: string
  gradient3: string
}

interface Height {
  header: string
  mobileHeader: string
  footer: string
}
interface Width {
  sidebar: string
  maxContent: string
}

declare module '@mui/material/styles' {
  interface Theme {
    gradient: Gradient
    height: Height
    width: Width
  }
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    gradient: Gradient
    height: Height
    width: Width
  }
  interface Theme {
    gradient: Gradient
    height: Height
    width: Width
  }
}

const themeConstants = {
  gradient: {
    gradient1: 'linear-gradient(98.91deg, #D8FF20 10.95%, #99F7F4 100%)',
    gradient2:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.06)), linear-gradient(98.91deg, #D8FF20 10.95%, #99F7F4 100%)',
    gradient3:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.19), rgba(0, 0, 0, 0.19)), linear-gradient(98.91deg, #D8FF20 10.95%, #99F7F4 100%)'
  },
  height: {
    header: '80px',
    mobileHeader: '51px',
    footer: '60px'
  },
  width: {
    sidebar: '250px',
    maxContent: '1110px'
  },
  shape: {
    border: '1px solid',
    borderRadius: 10
  },
  spacing: (factor: number) => `${1 * factor}px`
}

export const themeColors = {
  palette: {
    primary: {
      light: '#ADDFB5',
      main: '#1F9898',
      dark: '#CAF400',
      contrastText: '#1A1C1E'
    },
    secondary: {
      light: '#31B047',
      main: '#99F7F4',
      dark: '#00E4DD',
      contrastText: '#1A1C1E'
    },
    error: {
      main: '#FA0E0E',
      light: '#FA0E0E10'
    },
    warning: {
      main: '#F0B90B'
    },
    info: {
      main: '#1F9898'
    },
    success: {
      main: '#31B047'
    },
    background: {
      default: '#F7F7F7',
      paper: '#FFFFFF',
      secondary: '#484D50'
    },
    text: {
      primary: '#333333',
      secondary: '#828282',
      disabled: '#828282'
    },
    action: {
      disabledOpacity: 0.8,
      disabledBackground: '#DADADA'
    }
  },
  ...themeConstants
}

export const themeDarkColors = {
  palette: {
    primary: {
      light: '#ADDFB5',
      main: '#D8FF20',
      dark: '#CAF400',
      contrastText: '#1A1C1E'
    },
    secondary: {
      light: '#31B047',
      main: '#99F7F4',
      dark: '#00E4DD',
      contrastText: '#ffffff'
    },
    error: {
      main: '#FA0E0E',
      light: '#FA0E0E10'
    },
    warning: {
      main: '#F0B90B'
    },
    info: {
      main: '#1F9898'
    },
    success: {
      main: '#31B047'
    },
    background: {
      default: '#343739',
      paper: '#1A1C1E'
    },
    text: {
      primary: '#E6EAEE',
      secondary: '#878D92',
      disabled: '#61666A'
    },
    action: {
      disabledOpacity: 0.8,
      disabledBackground: '#282B2E'
    }
  },
  ...themeConstants
}

export const override: (theme: any) => any & {
  MuiButton: {
    defaultProps: {
      variant: 'text'
    }
  }
} = (theme: any) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: theme.palette.background.default,
        fontSize: 16,
        overflow: 'auto!important',
        paddingRight: '0px!important'
      },
      'html, input, textarea, button, body': {
        fontFamily: FONTS.content,
        fontDisplay: 'fallback'
      },
      '@supports (font-variation-settings: normal)': {
        'html, input, textarea, button, body': {
          fontFamily: FONTS.content,
          fontDisplay: 'fallback'
        }
      }
    }
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      disableRipple: true
    },
    styleOverrides: {
      root: {
        color: theme.palette.primary.contrastText,
        borderRadius: theme.shape.borderRadius,
        transition: '.3s',
        textTransform: 'none' as const,
        width: '100%',
        height: 60,
        fontSize: 16,
        fontWeight: 500
      },
      contained: {
        background: theme.gradient.gradient1,
        color: theme.palette.primary.contrastText,
        boxShadow: 'unset',
        '&:hover': {
          boxShadow: 'unset',
          background: theme.gradient.gradient2
        },
        '&:active': {
          boxShadow: 'unset',
          background: theme.gradient.gradient3
        },
        '&:disabled': {
          boxShadow: 'unset',
          background: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled
        }
      },
      containedSecondary: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        boxShadow: 'unset',
        '&:hover, :active': {
          boxShadow: 'unset',
          backgroundColor: theme.palette.secondary.dark
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity,
          backgroundColor: theme.palette.secondary.light
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.primary.dark,
          color: theme.palette.primary.dark
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity
        }
      },
      outlinedSecondary: {
        backgroundColor: 'transparent',
        borderColor: theme.palette.secondary.main,
        color: theme.palette.secondary.main,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.dark
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity
        }
      },
      text: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
        fontWeight: 500,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.dark,
          opacity: 1
        }
      },
      textPrimary: {
        color: theme.palette.primary.main,
        '&:hover, :active': {
          color: theme.palette.primary.dark
        }
      },
      textSecondary: {
        color: theme.palette.secondary.main,
        backgroundColor: 'transparent',
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: theme.palette.secondary.dark
        }
      }
    }
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        lineHeight: 1.2
      },
      body1: {
        fontSize: 14
      },
      body2: {
        fontSize: 12
      },
      h5: {
        fontSize: 28,
        fontWeight: 500
      },
      h6: {
        fontSize: 22,
        fontWeight: 500
      },
      caption: {
        fontSize: 12,
        color: theme.palette.text.primary
      },
      subtitle1: {},
      subtitle2: {}
    }
  }
})

const FONTS = {
  title: 'Monument Extended, Helvetica, sans-serif',
  content: 'Lato, Helvetica, sans-serif'
}

export const HideOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'none'
  }
}))

export const ShowOnMobile = styled('div', {
  shouldForwardProp: () => true
})<{ breakpoint?: 'sm' | 'md' }>(({ theme, breakpoint }) => ({
  display: 'none',
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'block'
  }
}))

export const theme = createTheme({
  ...themeColors,
  components: {
    ...override(themeColors)
  },
  typography: {
    allVariants: {
      fontFamily: FONTS.content
    }
  }
})

export const themeDark = createTheme({
  ...themeDarkColors,
  components: {
    ...override(themeDarkColors)
  },
  typography: {
    allVariants: {
      fontFamily: FONTS.content
    }
  }
})

export function ThemeProvider({ children }: any) {
  const darkMode = useIsDarkMode()

  return <MuiThemeProvider theme={darkMode ? themeDark : theme}>{children}</MuiThemeProvider>
}
