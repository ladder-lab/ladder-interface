import { Typography, styled } from '@mui/material'
import { GreenBtn } from '../../MyAccount/MintOrganModal'

const StepText = styled(Typography)`
  font-weight: 800;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.03em;
`
const StepNameText = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  line-height: 170%;
  margin-top: 9px;
  text-transform: capitalize;
`
const StepDescText = styled(Typography)`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  margin-top: 11px;
  color: #747678;
`
const StepBtn = styled(GreenBtn)`
  width: 247px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  padding: 12px 28px;
  font-weight: 600;
  '&:disabled': {
    pointer-events: none;
  }
`
export { StepText, StepNameText, StepDescText, StepBtn }
