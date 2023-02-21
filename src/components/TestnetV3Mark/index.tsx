import { Box, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { ReactComponent as Mark } from 'assets/svg/testnetv3Mark.svg'
import { isTestnetV3Address } from 'constants/default721List'
import { useMemo } from 'react'

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    padding: '7px 30px',
    maxWidth: 300,
    boxShadow: theme.shadows[1],
    color: theme.palette.text.primary,
    '& .MuiTooltip-arrow::before': {
      backgroundColor: theme.palette.common.white
    }
  }
}))

export default function TestnetV3Mark({ addresss }: { addresss: (string | undefined)[] }) {
  const isTestnetV3 = useMemo(() => isTestnetV3Address(addresss), [addresss])
  if (!isTestnetV3) return null
  return (
    <Box
      sx={{
        display: 'inherit',
        ml: 5
      }}
    >
      <LightTooltip placement="top" title="A token that can participate in Monopoly">
        <Mark />
      </LightTooltip>
    </Box>
  )
}
