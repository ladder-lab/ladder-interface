import { Box, Typography } from '@mui/material'
import { useIsDarkMode } from 'state/user/hooks'
import { Dots } from 'theme/components'
import AnimatedSvg from '.'

export function Loader({ color, margin = '0 auto', size = 90 }: { color?: string; margin?: string; size?: number }) {
  const isDarkMode = useIsDarkMode()
  return (
    <Box display="grid" gap={19}>
      <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 20 }}>
        Loading
        <Dots />
      </Typography>
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
    </Box>
  )
}
