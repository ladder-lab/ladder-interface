import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBody from 'components/AppBody'
import { Box, Typography, useTheme, Button, ButtonBase, Grid } from '@mui/material'
import { routes } from 'constants/routes'
import Card from 'components/Card'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { AllTokens } from 'models/allTokens'
import Tag from 'components/Tag'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Dots } from 'theme/components'
import { Loader } from 'components/AnimatedSvg/Loader'

// Dummy Data
import { ETHER } from 'constants/token'
import { ExternalLink } from 'theme/components'

export default function Pool() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [isLoading] = useState(false)

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
                onClick={() => navigate(routes.addLiquidity)}
                sx={{ fontSize: 12, height: 44, whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                Add Liquidity
              </Button>
            </Box>
          </Box>

          {isLoading ? (
            <Box minHeight={332} display="flex" justifyContent="center" alignItems="center">
              <Box display="grid" gap={19}>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: 20 }}>
                  Loading
                  <Dots />
                </Typography>
                <Loader size={90} />
              </Box>
            </Box>
          ) : (
            <Grid container mt={20} spacing={20}>
              <Grid item xs={12} md={4}>
                <PoolCard
                  currency0={ETHER}
                  currency1={ETHER}
                  title="DAI/Tickets for the community #56"
                  tokenAmount="123"
                  shareAmount="456"
                  onAdd={() => navigate(routes.addLiquidity)}
                  onRemove={() => navigate(routes.removeLiquidity)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PoolCard
                  currency0={ETHER}
                  currency1={ETHER}
                  title="DAI/Tickets for the community #56"
                  tokenAmount="123"
                  shareAmount="456"
                  onAdd={() => navigate(routes.addLiquidity)}
                  onRemove={() => navigate(routes.removeLiquidity)}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </AppBody>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mt: 50
        }}
      >
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

function PoolCard({
  currency0,
  currency1,
  title,
  tokenAmount,
  shareAmount,
  onAdd,
  onRemove
}: {
  currency0: AllTokens
  currency1: AllTokens
  title: string
  tokenAmount: string
  shareAmount: string
  onAdd: () => void
  onRemove: () => void
}) {
  const theme = useTheme()

  return (
    <Card gray padding="32px 24px 24px" style={{ borderRadius: '20px' }}>
      <Box display="flex" justifyContent="space-between">
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
        <Box display="flex" gap={16}>
          <Tag>ERC20</Tag>
          <Tag>ERC1155</Tag>
        </Box>
      </Box>
      <Typography fontSize={18} fontWeight={600} mt={16} mb={16}>
        {title}
      </Typography>
      <Box display="grid" gap={8}>
        <PoolAssetCard currency={currency0} value={'568.003563'} />
        <PoolAssetCard currency={currency1} value={'568.003563'} />
      </Box>
      <Box display="grid" gap={12} mt={16} mb={16}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }}>Your pool tokens</Typography>
          <Typography fontSize={16}>{tokenAmount}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: 16 }}>Your pool share</Typography>
          <Typography fontSize={16}>{shareAmount}</Typography>
        </Box>
      </Box>
      <ExternalLink href="#" showIcon>
        View accrued fees and analytics
      </ExternalLink>
      <Box display="flex" gap={8} mt={28}>
        <Button sx={{ borderRadius: '16px', height: 44 }} onClick={onAdd}>
          Add
        </Button>
        <Button
          sx={{
            borderRadius: '16px',
            height: 44,
            background: theme.palette.action.disabledBackground,
            color: theme.palette.text.secondary
          }}
          onClick={onRemove}
        >
          Remove
        </Button>
      </Box>
    </Card>
  )
}

function PoolAssetCard({ currency, value }: { currency: AllTokens; value: string }) {
  const theme = useTheme()

  return (
    <Card color={theme.palette.background.paper} padding="16px 20px 16px 16px">
      <Box display="flex" justifyContent="space-between">
        <Box display="grid" gap={8}>
          <Typography fontSize={12} fontWeight={400} color={theme.palette.text.secondary}>
            Pooled {currency.symbol}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            {value}
          </Typography>
        </Box>
        <CurrencyLogo currency={currency} size={'36px'} />
      </Box>
    </Card>
  )
}
