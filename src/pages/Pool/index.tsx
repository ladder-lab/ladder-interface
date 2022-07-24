import { useNavigate } from 'react-router-dom'
import AppBody from 'components/AppBody'
import { Box, Typography, useTheme, Button, ButtonBase } from '@mui/material'
import { routes } from 'constants/routes'

export default function Pool() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <>
      <AppBody width={'100%'} maxWidth={'1140px'}>
        <Box sx={{ padding: '30px 32px' }}>
          <Box sx={{ padding: '16px 20px', background: theme.palette.background.default, borderRadius: '8px' }}>
            <Typography sx={{ fontSize: 28, fontWeight: 500, mb: 12 }}>Liquid provider rewards</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: theme.palette.text.secondary }}>
              Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added
              to the pool, accrue in real time and can be claimed by withdrawing your liquidity. Read more about
              providing liquidity
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={40}>
            <Typography sx={{ fontSize: 24 }}>Your Liquidity</Typography>
            <Box display={'flex'} gap={20}>
              <Button
                sx={{
                  fontSize: 12,
                  height: 44,
                  background: theme.palette.background.default,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto'
                }}
              >
                Create a pair
              </Button>
              <Button
                onClick={() => navigate(routes.addLiquidy)}
                sx={{ fontSize: 12, height: 44, whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                Add Liquidity
              </Button>
            </Box>
          </Box>
        </Box>
      </AppBody>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'absolute', bottom: { xs: 40, md: 80 } }}>
        <Typography>Don’t see a pool you joined?</Typography>
        <ButtonBase
          sx={{ color: theme => theme.palette.text.secondary, fontSize: 16, textDecoration: 'underline' }}
          onClick={() => navigate(routes.importPool)}
        >
          Import it
        </ButtonBase>
      </Box>
    </>
  )
}
