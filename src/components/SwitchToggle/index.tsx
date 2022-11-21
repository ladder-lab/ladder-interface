import { ChangeEvent } from 'react'
import { Switch, styled } from '@mui/material'
import { switchClasses } from '@mui/material/Switch'
import { useIsDarkMode } from 'state/user/hooks'

const StyledSwitch = styled(Switch)(() => ({
  [`&.${switchClasses.root}`]: {
    width: 44,
    height: 24,
    padding: 0
  },
  [`& .${switchClasses.switchBase}`]: {
    padding: '4px 6px'
  },
  [`& .${switchClasses.thumb}`]: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF'
  },
  [`& .${switchClasses.track}`]: {
    width: 80,
    height: 24,
    opacity: '1 !important',
    // backgroundColor: '#DADADA',
    // border: '1px solid #cccccc',
    borderRadius: '30px',
    position: 'relative'
    // '&:before, &:after': {
    //   display: 'inline-block',
    //   position: 'absolute',
    //   top: '50%',
    //   width: '50%',
    //   transform: 'translateY(-50%)',
    //   textAlign: 'center'
    // }
    // '&:before': {
    //   content: '"On"',
    //   left: 4,
    //   opacity: 0
    // }
    // '&:after': {
    //   content: '"Off"',
    //   right: 4
    // }
  },
  [`& .${switchClasses.checked}`]: {
    [`&.${switchClasses.switchBase}`]: {
      transform: 'translateX(16px)',
      '&:hover': {}
    },
    [`& .${switchClasses.thumb}`]: {
      backgroundColor: '#FFFFFF'
    },
    [`& + .${switchClasses.track}`]: {
      backgroundColor: '#1F9898'
      // opacity: '1 !important',
      // border: '1px solid #cccccc'
      // borderRadius: '49px'
      // '&:before': {
      //   opacity: 1
      // },
      // '&:after': {
      //   opacity: 0
      // }
    }
  }
}))

export default function SwitchToggle({
  checked,
  disabled,
  onChange
}: {
  checked: boolean
  disabled?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const isDarkMode = useIsDarkMode()
  return (
    <StyledSwitch
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      sx={{
        [`& .${switchClasses.track}`]: {
          backgroundColor: isDarkMode ? '#484D50' : '#DADADA'
        }
      }}
    />
  )
}
