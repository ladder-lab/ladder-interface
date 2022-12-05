import { useTheme, Box, Typography, styled } from '@mui/material'
import QuestionHelper from 'components/essential/QuestionHelper'

const FancyButton = styled('button')(({ theme }) => ({
  color: theme.palette.text.primary,
  alignItems: 'center',
  height: '3rem',
  borderRadius: '14px',
  fontSize: '1rem',
  width: 'auto',
  minWidth: '3.5rem',
  border: `1px solid ${theme.palette.text.primary}`,
  outline: 'none',
  padding: '14px',
  background: theme.palette.background.default
}))

const Option = styled(FancyButton, {
  shouldForwardProp: prop => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  marginRight: '8px',
  '&:hover': {
    cursor: 'pointer',
    border: `1px solid ${active ? '#1F9898' : theme.palette.text.secondary}`
  },
  border: `1px solid ${active ? '#1F9898' : 'transparent'}`,
  color: active ? '#1F9898' : theme.palette.text.primary,
  '&:focus': {
    border: `1px solid ${active ? '#1F9898' : theme.palette.text.secondary}`
  }
}))

export default function TransactionSpeed({
  userTransactionSpeed,
  setUserTransactionSpeed
}: {
  userTransactionSpeed: number
  setUserTransactionSpeed: (userTransactionSpeed: number) => void
}) {
  const theme = useTheme()

  return (
    <Box display="grid" gap="24px">
      <Box display="grid" gap="8px">
        <Box display="flex" alignItems="center">
          <Typography fontWeight={400} fontSize={14} color={theme.palette.text.secondary}>
            Default Transaction Speed (GWEI)
          </Typography>
          <QuestionHelper
            text="Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees"
            style={{ marginLeft: 5 }}
          />
        </Box>
        <Box display="grid" gridTemplateColumns={'auto auto auto'}>
          <Option
            onClick={() => {
              setUserTransactionSpeed(1.1)
            }}
            active={userTransactionSpeed === 1.1}
          >
            Standard
          </Option>
          <Option
            onClick={() => {
              setUserTransactionSpeed(1.3)
            }}
            active={userTransactionSpeed === 1.3}
          >
            Fast
          </Option>
          <Option
            onClick={() => {
              setUserTransactionSpeed(1.5)
            }}
            active={userTransactionSpeed === 1.5}
          >
            Instant
          </Option>
        </Box>
      </Box>
    </Box>
  )
}
