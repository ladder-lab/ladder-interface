import AppBody from 'components/AppBody'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export default function ImportPool() {
  const navigate = useNavigate()

  return (
    <AppBody
      onReturnClick={() => navigate(routes.pool)}
      width={'100%'}
      maxWidth={'680px'}
      title="Import Pool"
      sx={{ padding: '24px 32px' }}
    >
      <Box></Box>
    </AppBody>
  )
}
