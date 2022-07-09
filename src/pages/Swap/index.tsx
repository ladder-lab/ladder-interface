import { useCallback, useState, ChangeEvent } from 'react'
import { Typography, Box } from '@mui/material'
import AppBody from 'components/AppBody'
import SelectButton from 'components/Button/SelectButton'
import NumericalInput from 'components/Input/InputNumerical'
import ActionButton from 'components/Button/ActionButton'

export default function Swap() {
  const [fromVal, setFromVal] = useState('')

  const onFromVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFromVal(e.target.value)
  }, [])

  return (
    <>
      <AppBody width={'680px'} maxWidth={'680px'}>
        <Box sx={{ padding: '33px 32px 30px' }}>
          <Typography fontSize={28} mb={45}>
            SWAP
          </Typography>
          <Box display="flex" gap={16}>
            <SelectButton width={'346px'}>DAI</SelectButton>
            <NumericalInput value={fromVal} onChange={onFromVal} maxWidth={254} />
          </Box>
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
