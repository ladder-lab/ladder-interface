import { Box } from '@mui/material'
import { useIsDarkMode } from 'state/user/hooks'
import AnimatedSvg from '.'

export function Loader({ color, margin = '0 auto', size = 200 }: { color?: string; margin?: string; size?: number }) {
  const isDarkMode = useIsDarkMode()
  return (
    <Box width={size} height={size} margin={margin}>
      <AnimatedSvg
        fileName={isDarkMode ? 'dark_loader' : 'light_loader'}
        sx={{
          '& path': {
            stroke: `${color ? color : '#25252530'}!important`
          }
        }}
      />
    </Box>
  )
}
