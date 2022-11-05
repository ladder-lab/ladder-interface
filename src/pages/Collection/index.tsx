import { useMemo } from 'react'
import { Box, Backdrop, CircularProgress, Typography, Button, Grid, useTheme } from '@mui/material'
import Card from 'components/Card'
import Image from 'components/Image'
// import LogoText from 'components/LogoText'
import Divider from 'components/Divider'
// import DummyAvatar from 'assets/svg/dummy_avatar.svg'
// import BscLogo from 'assets/svg/bsc.svg'
// import { ExternalLink } from 'theme/components'
// import { ReactComponent as DummyChart } from 'assets/svg/dummy_chart.svg'
// import { ReactComponent as ShareIcon } from 'assets/svg/share_icon.svg'
// import { AllTokens } from 'models/allTokens'
// import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
// import { ETHER } from 'constants/token'
import useBreakpoint from 'hooks/useBreakpoint'
import { useNavigate, useParams } from 'react-router-dom'
import {
  StatTokenInfo,
  StatTopPoolsProp,
  StatTopTokensProp,
  useTopPoolsList,
  useTopTokensList
} from 'hooks/useStatBacked'
import { ChainId } from 'constants/chain'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import Copy from 'components/essential/Copy'
import { formatMillion, getEtherscanLink } from 'utils'
import { PoolPairType } from 'pages/Statistics'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { routes } from 'constants/routes'
import { ArrowBack } from '@mui/icons-material'

export default function Collection() {
  const isDownMd = useBreakpoint('md')
  const { type, chainId, address, token1155Id } = useParams<{
    type: Mode
    chainId: string
    address: string
    token1155Id: string
  }>()
  const curChainId = Number(chainId) as ChainId
  const { result, loading } = useTopTokensList(
    curChainId,
    type || Mode.ERC20,
    1,
    address || '',
    Number(token1155Id || 0)
  )
  const tokenDetailData = useMemo(() => result[0], [result])

  const curPoolPairType = useMemo(() => {
    if (Mode.ERC721 === type) {
      return PoolPairType.ERC20_ERC721
    } else if (Mode.ERC1155 === type) {
      return PoolPairType.ERC20_ERC1155
    }
    return PoolPairType.ERC20_ERC20
  }, [type])

  const { result: topPoolsResult, page: topPoolsListPage } = useTopPoolsList(
    curChainId,
    address || '',
    curPoolPairType,
    Number(token1155Id || 0)
  )
  const topPoolsList = useMemo(() => {
    return topPoolsResult.map((item, index) => ({
      no: (topPoolsListPage.pageSize - 1) * topPoolsListPage.pageSize + index + 1,
      curPoolPairType,
      ...item
    }))
  }, [curPoolPairType, topPoolsListPage.pageSize, topPoolsResult])

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1380px',
        padding: { xs: 0, sm: '40px' },
        margin: 'auto'
      }}
    >
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={isDownMd ? 0 : 20} width="100%">
        <Grid item xs={12} md={6}>
          <MainCard token={tokenDetailData?.token} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard chainId={curChainId} info={tokenDetailData} />
        </Grid>
      </Grid>
      <Grid container spacing={20} mt={20} sx={{ padding: { xs: 15, sm: 0 } }}>
        <Grid item xs={12} sx={{ padding: { xs: 16, md: 0 } }}>
          <Typography sx={{ fontSize: 24, fontWeight: 600 }}>Top pairs</Typography>
        </Grid>
        {topPoolsList.map(item => (
          <Grid key={`collection -${item.no}`} item xs={12} md={4}>
            <PairCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

function MainCard({ token }: { token: StatTokenInfo | undefined }) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')
  const navigate = useNavigate()

  const data = useMemo(() => {
    return {
      coverImage: token?.logo || '',
      name: token ? `${token.name} ${token.type === Mode.ERC1155 ? ' #' + token.tokenId : ''}` : '',
      address: token?.address || '-',
      supply: '-',
      holder: '-'
    }
  }, [token])

  return (
    <Card
      color={theme.palette.background.paper}
      style={{ height: isDownMd ? 'auto' : 698, overflow: 'hidden', borderRadius: isDownMd ? '0' : '12px' }}
    >
      <Box sx={{ width: '100%', height: isDownMd ? 'auto' : 587, position: 'relative' }}>
        <Image
          alt="collection-image"
          src={data.coverImage}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <Box
          onClick={() => navigate(routes.explorer, { replace: true })}
          sx={{
            position: 'absolute',
            width: 127,
            height: 48,
            left: 20,
            top: 20,
            background: 'rgba(255,255,255, 0.5)',
            color: '#12151B',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            borderRadius: '12px'
          }}
        >
          <ArrowBack sx={{ mr: 8 }} />
          Go back
        </Box>
      </Box>
      <Box sx={{ width: 590, height: 111, padding: '20px 24px', display: 'grid', gap: 8 }}>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>Name: {data.name}</Typography>
        <Typography display={'flex'} sx={{ color: theme.palette.text.secondary, fontSize: 14, wordBreak: 'all' }}>
          Contract: {data.address}
          <Copy toCopy={data.address} />
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
          Supply/Holder:{data.supply}/{data.holder}
        </Typography>
      </Box>
    </Card>
  )
}

function StatCard({ info, chainId }: { info: StatTopTokensProp | undefined; chainId: ChainId }) {
  const theme = useTheme()
  const isDownMd = useBreakpoint('md')

  const data = useMemo(() => {
    return {
      collectionType: (
        <>
          <span style={{ textTransform: 'uppercase' }}>{info?.token.type}</span> Collection
        </>
      ),
      title: info
        ? `${info.token.name} (${info.token.symbol}) ${
            info.token.type === Mode.ERC1155 ? ' #' + info.token.tokenId : ''
          }`
        : ''
    }
  }, [info])

  return (
    <Card
      color={theme.palette.background.paper}
      padding="28px 24px"
      style={{ height: isDownMd ? 'auto' : 698, borderRadius: isDownMd ? '0' : '12px' }}
    >
      <Box sx={{ height: isDownMd ? 'auto' : 698 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: theme.palette.info.main, fontSize: 14, fontWeight: 500 }}>
            {data.collectionType}
          </Typography>
          {/* <ButtonBase onClick={() => {}}>
            Share <ShareIcon style={{ marginLeft: 8 }} />
          </ButtonBase> */}
        </Box>
        <Typography variant="h1" sx={{ fontSize: 18, mt: 16, mb: 16 }}>
          {data.title}
        </Typography>
        {/* <Box sx={{ display: 'flex', gap: 8 }}>
          <Box sx={{ orderRadius: '50%', width: 40, height: 40 }}>
            <Image src={data.avatar} alt="creator-avatar" style={{ width: '100%', height: '100%' }} />
          </Box>
          <Box sx={{ display: 'grid', gap: 4 }}>
            <Typography>Creator</Typography>
            <Typography>{data.creator}</Typography>
          </Box>
        </Box> */}
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
          <Button
            variant="outlined"
            sx={{ height: 48, borderColor: theme.palette.info.main, color: theme.palette.info.main }}
            onClick={() => window.open(getEtherscanLink(chainId, info?.token.address || '', 'token'))}
          >
            View on explorer
          </Button>

          {/* <Button
            variant="outlined"
            sx={{ height: 48, borderColor: theme.palette.info.main, color: theme.palette.info.main }}
            onClick={() => {}}
          >
            View accrued fees and analytics
          </Button> */}
        </Box>
        <Divider />
        <Grid container spacing={10} mt={20}>
          <Grid item xs={6}>
            <NumericalCard
              title="Transactions(24hrs)"
              value={info ? formatMillion(Number(info.transfers) || 0, '', 2) : '-'}
              percentage={0}
            />
          </Grid>
          <Grid item xs={6}>
            <NumericalCard
              title="Volume(24hrs)"
              value={info ? formatMillion(Number(info.Volume) || 0, '$ ', 2) : '-'}
              percentage={0}
            />
          </Grid>
          <Grid item xs={12}>
            <NumericalCard
              title="Total Liquidity"
              value={info ? formatMillion(Number(info.tvl) || 0, '$ ', 2) : '-'}
              percentage={0}
            />
          </Grid>
        </Grid>
        <Box mt={40} sx={{ width: '100%' }}>
          {/* <DummyChart style={{ width: '100%' }} /> */}
        </Box>
      </Box>
    </Card>
  )
}

function NumericalCard({ title, value }: { title: string; value: string; percentage: number }) {
  const theme = useTheme()

  return (
    <Card gray padding="20px 24px">
      <Box>
        <Typography sx={{ color: theme => theme.palette.text.secondary, fontSize: 14, fontWeight: 400 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ color: theme.palette.text.primary, fontSize: 32, fontWeight: 700 }}>{value}</Typography>
          {/* <Typography sx={{ fontSize: 12 }}>
            {percentage > 0 ? '+' : ''} {percentage * 100}%
          </Typography> */}
        </Box>
      </Box>
    </Card>
  )
}

function PairCard({ item }: { item: StatTopPoolsProp & { no: number; curPoolPairType: PoolPairType } }) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Card padding="20px 17px" color={theme.palette.background.paper}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 12 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}> #{item.no}</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.info.main }}>
          {item.curPoolPairType}
        </Typography>
      </Box>
      <Card light padding="20px 34px 24px">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box>
            <CurrencyLogo size={'48px'} logoUrl={item.token0.logo} />
            <CurrencyLogo size={'48px'} style={{ marginLeft: -8 }} logoUrl={item.token1.logo} />
          </Box>
          <Box display={'flex'}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 16 }}>{item.token0.symbol}</Typography>
            {item.token0.type === Mode.ERC1155 && (
              <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 16 }}>#{item.token0.tokenId}</Typography>
            )}
            <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 16 }}>/{item.token1.symbol}</Typography>
            {item.token1.type === Mode.ERC1155 && (
              <Typography sx={{ fontSize: 18, fontWeight: 600, mt: 16 }}>#{item.token1.tokenId}</Typography>
            )}
          </Box>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Typography sx={{ mt: 20, fontSize: 20, fontWeight: 600 }}>Liquidity</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: theme.palette.text.secondary }}>
            {formatMillion(Number(item.tvl) || 0, '$ ', 2)}
          </Typography>
          {/* <Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.text.secondary }}>
            ({liquidity_varies_percentage}%)
          </Typography> */}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 16, mt: 24, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Volume (24hrs)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {formatMillion(Number(item.Volume) || 0, '$ ', 2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Volume (7d)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {formatMillion(Number(item.Volume7) || 0, '$ ', 2)}
          </Typography>
        </Box>
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            Fees (24hrs)
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>${fees}</Typography>
        </Box> */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.secondary }}>
            1y Fees/ Liquidity
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {fees_per_liquidity ? '+' : ''}
            {fees_per_liquidity}%
          </Typography>
        </Box> */}
      </Box>
      {/* <Box sx={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
        <ExternalLink underline="always" href="#" style={{ color: theme.palette.info.main }}>
          View accrued fees and analytics
        </ExternalLink>
      </Box> */}

      <Box sx={{ display: 'flex', gap: 12, mt: 24 }}>
        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              routes.addLiquidity +
                `/${item.token0.address}/${item.token1.address}/${
                  item.token0.type === Mode.ERC20 ? '' : item.token0.type
                }&${item.token1.type}`
            )
          }
          sx={{ fontSize: 16, height: 48, borderColor: theme.palette.info.main, color: theme.palette.info.main }}
        >
          Add
        </Button>
        {/* <Button
          variant="outlined"
          // onClick={() => navigate(routes.swap)}
          sx={{ fontSize: 16, height: 48, borderColor: theme.palette.info.main, color: theme.palette.info.main }}
        >
          Swap
        </Button> */}
      </Box>
    </Card>
  )
}
