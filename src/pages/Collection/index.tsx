import { useMemo } from 'react'
import { Box, Typography, ButtonBase, Button, Grid, useTheme } from '@mui/material'
import Card from 'components/Card'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import DummyAvatar from 'assets/svg/dummy_avatar.svg'
import BscLogo from 'assets/svg/bsc.svg'
import { ExternalLink } from 'theme/components'

export default function Collection() {
  const pairCollectionsData = useMemo(() => {
    return [
      {
        no: 1,
        collectionType: 'ERC20-ERC1155',
        title: 'DAI/Tickets for the community #56',
        liquidity: 12345,
        liquidity_varies_percentage: 0.3,
        volume_24h: 12345,
        volume_7d: 12345,
        fees: 123,
        fees_per_liquidity: 0.05
      },
      {
        no: 2,
        collectionType: 'ERC20-ERC1155',
        title: 'DAI/Tickets for the community #56',
        liquidity: 12345,
        liquidity_varies_percentage: 0.3,
        volume_24h: 12345,
        volume_7d: 12345,
        fees: 123,
        fees_per_liquidity: 0.05
      },
      {
        no: 3,
        collectionType: 'ERC20-ERC1155',
        title: 'DAI/Tickets for the community #56',
        liquidity: 12345,
        liquidity_varies_percentage: 0.3,
        volume_24h: 12345,
        volume_7d: 12345,
        fees: 123,
        fees_per_liquidity: 0.05
      }
    ]
  }, [])

  return (
    <>
      <Grid container spacing={20} sx={{ padding: '40px 120px' }}>
        <Grid item xs={6}>
          <MainCard />
        </Grid>
        <Grid item xs={6}>
          <StatCard />
        </Grid>
        <Grid item xs={12}>
          <Typography>Top pairs</Typography>
        </Grid>
        <>
          {pairCollectionsData.map(
            (
              {
                no,
                collectionType,
                title,
                liquidity,
                liquidity_varies_percentage,
                volume_24h,
                volume_7d,
                fees,
                fees_per_liquidity
              },
              idx
            ) => (
              <Grid key={`collection -${idx}`} item xs={4}>
                <PairCard
                  no={no}
                  collectionType={collectionType}
                  title={title}
                  liquidity={liquidity}
                  liquidity_varies_percentage={liquidity_varies_percentage}
                  volume_24h={volume_24h}
                  volume_7d={volume_7d}
                  fees={fees}
                  fees_per_liquidity={fees_per_liquidity}
                />
              </Grid>
            )
          )}
        </>
      </Grid>
    </>
  )
}

function MainCard() {
  return (
    <Card style={{ height: 698 }}>
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
    <Card padding="28px 24px" style={{ height: 698 }}>
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

function PairCard({
  no,
  collectionType,
  // logo1,
  // logo2,
  title,
  liquidity,
  liquidity_varies_percentage,
  volume_24h,
  volume_7d,
  fees,
  fees_per_liquidity
}: {
  no: number
  collectionType: string
  title: string
  liquidity: number
  liquidity_varies_percentage: number
  volume_24h: number
  volume_7d: number
  fees: number
  fees_per_liquidity: number
}) {
  return (
    <Card padding="20px 17px">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>#{no}</Typography>
        <Typography>{collectionType}</Typography>
      </Box>
      <Card light padding="20px 34px 24px">
        <Box sx={{ display: 'flex' }}>
          {/* <DualLogo /> */}
          <Typography>{title}</Typography>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Typography>Liquidity</Typography>
        <Typography>
          ${liquidity} ({liquidity_varies_percentage}%)
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Box sx={{ display: 'flex', justifyContent: 'spacw-between' }}>
          <Typography>Volume (24hrs)</Typography>
          <Typography>{volume_24h}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'spacw-between' }}>
          <Typography>Volume (7d)</Typography>
          <Typography>{volume_7d}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'spacw-between' }}>
          <Typography>Fees (24hrs)</Typography>
          <Typography>{fees}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'spacw-between' }}>
          <Typography>1y Fees/ Liquidity</Typography>
          <Typography>{fees_per_liquidity}</Typography>
        </Box>
      </Box>
      <ExternalLink underline="always" href="#">
        View accrued fees and analytics
      </ExternalLink>
    </Card>
  )
}
