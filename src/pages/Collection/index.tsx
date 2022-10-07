import { Box, Typography, ButtonBase, Button, Grid, useTheme } from '@mui/material'
import Card from 'components/Card'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import DummyAvatar from 'assets/svg/dummy_avatar.svg'
import BscLogo from 'assets/svg/bsc.svg'

export default function Collection() {
  return (
    <>
      <Box sx={{ display: 'flex', gap: 20, mt: 40 }}>
        <MainCard />
        <StatCard />
      </Box>
      <Typography>Top pairs</Typography>
      <Box sx={{ display: 'flex', gap: 20 }}>
        <PairCard /> <PairCard /> <PairCard />
      </Box>
    </>
  )
}

function MainCard() {
  return (
    <Card>
      <Box sx={{ width: 590, height: 587 }}>
        <Image alt="collection-image" src="#" />
      </Box>
      <Box sx={{ width: 590, height: 111, padding: '20px 24px', display: 'grid', gap: 8 }}>
        <Typography>Name: Tickets for the community #56</Typography>
        <Typography>Contract: 0x344dDf5a03AFE67543FB23c674C6797599a0A507</Typography>
        <Typography>Supply/Holder:20000/500</Typography>
      </Box>
    </Card>
  )
}

function StatCard() {
  const theme = useTheme()
  return (
    <Card padding="28px 24px">
      <Box sx={{ width: 590, height: 698 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: theme.palette.info.main, fontSize: 14, fontWeight: 500 }}>
            ERC721 Collection
          </Typography>
          <ButtonBase onClick={() => {}}>Share </ButtonBase>
        </Box>
        <Typography variant="h5" sx={{ fontSize: 18, fontWeight: 400, mt: 16, mb: 16 }}>
          NM0979 The Truth is Often Somewhere in Between
        </Typography>
        <Box sx={{ display: 'flex', gap: 8 }}>
          <Box sx={{ orderRadius: '50%', width: 40, height: 40 }}>
            <Image src={DummyAvatar} alt="creator-avatar" style={{ width: '100%', height: '100%' }} />
          </Box>
          <Box sx={{ display: 'grid', gap: 4 }}>
            <Typography>Creator</Typography>
            <Typography>1livinginzen</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 16, mt: 21, mb: 44 }}>
          <Button variant="outlined" sx={{ height: 48 }}>
            <LogoText logo={BscLogo} text={'View on BSCscan'} size={'24px'} />
          </Button>

          <Button variant="outlined" sx={{ height: 48 }}>
            View accrued fees and analytics
          </Button>
        </Box>
        <Divider />
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <NumericalCard title="Transations(24hrs)" value="2265" percentage={0.05} />
          </Grid>
          <Grid item xs={6}>
            <NumericalCard title="Volume(24hrs)" value="2265" percentage={0.05} />
          </Grid>
          <Grid item xs={12}>
            <NumericalCard title="Total Liquidity" value="2265" percentage={0.05} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

function NumericalCard({ title, value, percentage }: { title: string; value: string; percentage: number }) {
  return (
    <Card gray padding="20px 24px">
      <Box>
        <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 14, fontWeight: 400 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ color: '#12151B', fontSize: 32, fontWeight: 700 }}>{value}</Typography>
          <Typography>{percentage * 100}%</Typography>
        </Box>
      </Box>
    </Card>
  )
}

function PairCard() {
  return (
    <Card padding="20px 17px">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>#1</Typography>
        <Typography>ERC20-ERC1155</Typography>
      </Box>
      <Card light padding="20px 34px 24px">
        <Box sx={{ display: 'flex' }}>
          {/* <DualLogo /> */}
          <Typography>DAI/Tickets for the community #56</Typography>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Typography>Liquidity</Typography>
        <Typography>$5321 (+33%)</Typography>
      </Box>
      <Box></Box>
    </Card>
  )
}
