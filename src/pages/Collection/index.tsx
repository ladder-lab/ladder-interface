import { useMemo } from 'react'
import { Box, Typography, ButtonBase, Button, Grid, useTheme } from '@mui/material'
import Card from 'components/Card'
import Image from 'components/Image'
import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
import DummyAvatar from 'assets/svg/dummy_avatar.svg'
import BscLogo from 'assets/svg/bsc.svg'
import { ExternalLink } from 'theme/components'
import DummyCollectionCover from 'assets/images/dummy_collection_cover.png'
import { ReactComponent as DummyChart } from 'assets/svg/dummy_chart.svg'
import { ReactComponent as ShareIcon } from 'assets/svg/share_icon.svg'
import { AllTokens } from 'models/allTokens'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { ETHER } from 'constants/token'
import useBreakpoint from 'hooks/useBreakpoint'

export default function Collection() {
  const isDownMd = useBreakpoint('md')

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
      <Grid container spacing={isDownMd ? 0 : 20} sx={{ padding: { xs: 0, md: '40px 120px' } }}>
        <Grid item xs={12} md={6}>
          <MainCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard />
        </Grid>
      </Grid>
      <Grid container spacing={20} sx={{ padding: { xs: 16, md: '0 120px' } }}>
        <Grid item xs={12} sx={{ padding: { xs: 16, md: 0 } }}>
          <Typography sx={{ fontSize: 24, fontWeight: 600 }}>Top pairs</Typography>
        </Grid>
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
            <Grid key={`collection -${idx}`} item xs={12} md={4}>
              <PairCard
                no={no}
                collectionType={collectionType}
                currency0={ETHER}
                currency1={ETHER}
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
      </Grid>
    </>
  )
}

function MainCard() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const data = useMemo(() => {
    return {
      coverImage: DummyCollectionCover,
      name: 'Tickets for the community #56',
      address: '0x344dDf5a03AFE67543FB23c674C6797599a0A507',
      supply: 20000,
      holder: 500
    }
  }, [])

  return (
    <Card
      color={theme.palette.background.paper}
      style={{ height: 698, overflow: 'hidden', borderRadius: isDownMd ? '0' : '12px' }}
    >
      <Box sx={{ width: '100%', height: 587 }}>
        <Image
          alt="collection-image"
          src={data.coverImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{ width: 590, height: 111, padding: '20px 24px', display: 'grid', gap: 8 }}>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>Name: {data.name}</Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>Contract: {data.address}</Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
          Supply/Holder:{data.supply}/{data.holder}
        </Typography>
      </Box>
    </Card>
  )
}

function StatCard() {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const data = useMemo(() => {
    return {
      collectionType: 'ERC721 Collection',
      title: 'NM0979 The Truth is Often Somewhere in Between',
      creator: '1livinginzen',
      avatar: DummyAvatar
    }
  }, [])

  return (
    <Card
      color={theme.palette.background.paper}
      padding="28px 24px"
      style={{ height: 698, borderRadius: isDownMd ? '0' : '12px' }}
    >
      <Box sx={{ height: 698 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: theme.palette.info.main, fontSize: 14, fontWeight: 500 }}>
            {data.collectionType}
          </Typography>
          <ButtonBase onClick={() => {}}>
            Share <ShareIcon style={{ marginLeft: 8 }} />
          </ButtonBase>
        </Box>
        <Typography variant="h1" sx={{ fontSize: 18, mt: 16, mb: 16 }}>
          {data.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 8 }}>
          <Box sx={{ orderRadius: '50%', width: 40, height: 40 }}>
            <Image src={data.avatar} alt="creator-avatar" style={{ width: '100%', height: '100%' }} />
          </Box>
          <Box sx={{ display: 'grid', gap: 4 }}>
            <Typography>Creator</Typography>
            <Typography>{data.creator}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 16,
            mt: 21,
            mb: 44
          }}
        >
          <Button variant="outlined" sx={{ height: 48 }} onClick={() => {}}>
            <LogoText logo={BscLogo} text={'View on BSCscan'} size={'24px'} />
          </Button>

          <Button variant="outlined" sx={{ height: 48 }} onClick={() => {}}>
            View accrued fees and analytics
          </Button>
        </Box>
        <Divider />
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <NumericalCard title="Transations(24hrs)" value="2,265" percentage={0.05} />
          </Grid>
          <Grid item xs={6}>
            <NumericalCard title="Volume(24hrs)" value="2,265" percentage={0.05} />
          </Grid>
          <Grid item xs={12}>
            <NumericalCard title="Total Liquidity" value="2,265" percentage={0.05} />
          </Grid>
        </Grid>
        <Box mt={40} sx={{ width: '100%' }}>
          <DummyChart style={{ width: '100%' }} />
        </Box>
      </Box>
    </Card>
  )
}

function NumericalCard({ title, value, percentage }: { title: string; value: string; percentage: number }) {
  const theme = useTheme()

  return (
    <Card gray padding="20px 24px">
      <Box>
        <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 14, fontWeight: 400 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ color: theme.palette.text.primary, fontSize: 32, fontWeight: 700 }}>{value}</Typography>
          <Typography sx={{ fontSize: 12 }}>
            {percentage > 0 ? '+' : ''} {percentage * 100}%
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

function PairCard({
  no,
  collectionType,
  currency0,
  currency1,
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
  currency0?: AllTokens
  currency1?: AllTokens
  title: string
  liquidity: number
  liquidity_varies_percentage: number
  volume_24h: number
  volume_7d: number
  fees: number
  fees_per_liquidity: number
}) {
  const theme = useTheme()
  return (
    <Card padding="20px 17px" color={theme.palette.background.paper}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 12 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}> #{no}</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.info.main }}>{collectionType}</Typography>
      </Box>
      <Card light padding="20px 34px 24px">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} />
          <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 16 }}>{title}</Typography>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Typography sx={{ mt: 20, fontSize: 20, fontWeight: 600 }}>Liquidity</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: theme.palette.text.secondary }}>
            ${liquidity}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.text.secondary }}>
            ({liquidity_varies_percentage}%)
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 16, mt: 24, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Volume (24hrs)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>${volume_24h}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Volume (7d)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>${volume_7d}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Fees (24hrs)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>${fees}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            1y Fees/ Liquidity
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {fees_per_liquidity ? '+' : ''}
            {fees_per_liquidity}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
        <ExternalLink underline="always" href="#">
          View accrued fees and analytics
        </ExternalLink>
      </Box>

      <Box sx={{ display: 'flex', gap: 12 }}>
        <Button variant="outlined" onClick={() => {}} sx={{ fontSize: 16, height: 48 }}>
          Add
        </Button>
        <Button variant="outlined" onClick={() => {}} sx={{ fontSize: 16, height: 48 }}>
          Swap
        </Button>
      </Box>
    </Card>
  )
}
