import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box, IconButton, SxProps } from '@mui/material'
import AppBody from 'components/AppBody'
import SelectButton from 'components/Button/SelectButton'
import NumericalInput from 'components/Input/InputNumerical'
import ActionButton from 'components/Button/ActionButton'
import { ReactComponent as SettingIcon } from 'assets/svg/setting.svg'
import { ReactComponent as ArrowCircle } from 'assets/svg/arrow_circle.svg'

export default function Swap() {
  const [fromVal, setFromVal] = useState('')

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  return (
    <>
      <AppBody width={'680px'} maxWidth={'680px'}>
        <Box sx={{ padding: '33px 32px 30px', position: 'relative' }}>
          <Typography fontSize={28} mb={45}>
            SWAP
          </Typography>
          <SettingButton sx={{ position: 'absolute', right: 32, top: 24 }} />
          <Box display="flex" gap={16}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput
              value={fromVal}
              onChange={onFromVal}
              maxWidth={254}
              subStr="~$568.23"
              subStr2="Balence: 2.35512345 DAI"
            />
          </Box>
          <ArrowCircle />
          <Box display="flex" gap={16}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput value={fromVal} onChange={onFromVal} maxWidth={254} />
          </Box>
          <ActionButton onAction={() => {}} actionText="Swap" error="Select a Token" />
        </Box>
      </AppBody>
    </>
  )
}

function SettingButton({ sx }: { sx: SxProps }) {
  return (
    <IconButton sx={{ backgroundColor: '#F7F7F7', borderRadius: '8px', width: 52, height: 52, ...sx }}>
      <SettingIcon />
    </IconButton>
  )
}
