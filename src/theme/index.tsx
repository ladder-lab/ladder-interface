import { createTheme, darken, styled, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useIsDarkMode } from 'state/user/hooks'

export type PaletteMode = 'light' | 'dark'

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
  minContent: string
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
    color: {
      color1: string
      color2: string
      color3: string
      color4: string
    }
  }
  interface Theme {
    gradient: Gradient
    height: Height
    width: Width
    color: {
      color1: string
      color2: string
      color3: string
      color4: string
    }
  }
}

const themeConstants = {
  gradient: {
    gradient1: 'linear-gradient(98.91deg, #D8FF20 10.95%, #99F7F4 100%)',
    gradient2:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.06)), linear-gradient(98.91deg, #D8FF20 10.95%, #99F7F4 100%)',
    gradient3: 'linear-gradient(98.91deg, rgba(216, 255, 32, 0.2) 10.95%, rgba(153, 247, 244, 0.2) 100%)'
  },
  height: {
    header: '80px',
    mobileHeader: '67px',
    footer: '60px'
  },
  width: {
    sidebar: '250px',
    maxContent: '1110px',
    minContent: '350px'
  },
  shape: {
    border: '1px solid',
    borderRadius: 10
  },
  spacing: (factor: number) => `${1 * factor}px`
}

export const themeColors = {
  primary: {
    light: '#ADDFB5',
    main: '#1F9898',
    dark: darken('#1F9898', 0.3),
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
    disabledOpacity: 0.6,
    disabledBackground: '#F7F7F7'
  }
}

export const themeDarkColors = {
  primary: {
    light: '#ADDFB5',
    main: '#D8FF20',
    dark: darken('#D8FF20', 0.2),
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
    disabledOpacity: 0.6,
    disabledBackground: '#343739'
  }
}

export const override: (palette: any) => any & {
  MuiButton: {
    defaultProps: {
      variant: 'text'
    }
  }
} = (palette: any) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: palette.background.paper === '#1A1C1E' ? '#000000' : '#FFF6F6',
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
        color: palette.primary.contrastText,
        borderRadius: themeConstants.shape.borderRadius,
        transition: '.3s',
        textTransform: 'none' as const,
        width: '100%',
        height: 60,
        fontSize: 16,
        fontWeight: 500
      },
      contained: {
        background: themeConstants.gradient.gradient1,
        color: palette.primary.contrastText,
        boxShadow: 'unset',
        '&:hover': {
          boxShadow: 'unset',
          background: themeConstants.gradient.gradient2
        },
        '&:active': {
          boxShadow: 'unset',
          background: themeConstants.gradient.gradient3
        },
        '&:disabled': {
          boxShadow: 'unset',
          background: palette.action.disabledBackground,
          color: palette.text.disabled
        }
      },
      containedSecondary: {
        backgroundColor: palette.secondary.main,
        color: palette.secondary.contrastText,
        boxShadow: 'unset',
        '&:hover, :active': {
          boxShadow: 'unset',
          backgroundColor: palette.secondary.dark
        },
        '&:disabled': {
          opacity: palette.action.disabledOpacity,
          backgroundColor: palette.secondary.light
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: palette.primary.main,
        color: palette.primary.main,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: palette.primary.dark,
          color: palette.primary.dark
        },
        '&:disabled': {
          opacity: palette.action.disabledOpacity
        }
      },
      outlinedSecondary: {
        backgroundColor: 'transparent',
        borderColor: palette.secondary.main,
        color: palette.secondary.main,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          borderColor: palette.secondary.dark,
          color: palette.secondary.dark
        },
        '&:disabled': {
          opacity: palette.action.disabledOpacity
        }
      },
      text: {
        backgroundColor: 'transparent',
        color: palette.primary.main,
        fontWeight: 500,
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: palette.primary.dark,
          opacity: 1
        }
      },
      textPrimary: {
        color: palette.primary.main,
        '&:hover, :active': {
          color: palette.primary.dark
        }
      },
      textSecondary: {
        color: palette.secondary.main,
        backgroundColor: 'transparent',
        '&:hover, :active': {
          backgroundColor: 'transparent',
          color: palette.secondary.dark
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
      h1: {
        fontSize: 45,
        fontWeight: 700,
        fontFamily: FONTS.title
      },
      h5: {
        fontSize: 28,
        fontWeight: 500,
        fontFamily: FONTS.title
      },
      h6: {
        fontSize: 22,
        fontWeight: 500
      },
      caption: {
        fontSize: 12,
        color: palette.text.primary
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
  palette: { mode: 'light', ...themeColors },
  ...themeConstants,
  components: {
    ...override(themeColors)
  },
  typography: {
    allVariants: {
      fontFamily: FONTS.content
    }
  },
  color: {
    color1: '#eee',
    color2: '#FCFCFC',
    color3: '#F6F6F6',
    color4: '#fff'
  }
})

export const themeDark = createTheme({
  palette: { mode: 'dark', ...themeDarkColors },
  ...themeConstants,
  components: {
    ...override(themeDarkColors)
  },
  typography: {
    allVariants: {
      fontFamily: FONTS.content
    }
  },
  color: {
    color1: '#343739',
    color2: '#212324',
    color3: '#343739',
    color4: '#000'
  }
})

export function ThemeProvider({ children }: any) {
  const darkMode = useIsDarkMode()

  return <MuiThemeProvider theme={darkMode ? themeDark : theme}>{children}</MuiThemeProvider>
}
