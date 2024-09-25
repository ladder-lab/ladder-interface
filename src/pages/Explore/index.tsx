import { Box, useTheme, IconButton, styled, Typography, Backdrop, CircularProgress } from '@mui/material'
import { ReactComponent as Twitter } from 'assets/svg/socials/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/socials/discord.svg'
import { ReactComponent as Website } from 'assets/svg/socials/website.svg'
import { ReactComponent as TwitterLight } from 'assets/svg/socials/twitter_light.svg'
import { ReactComponent as DiscordLight } from 'assets/svg/socials/discord_light.svg'
import { ReactComponent as WebsiteLight } from 'assets/svg/socials/website_light.svg'
import { ExternalLink } from 'theme/components'
import { ExternalLinks } from 'constants/external_links'
import Card from 'components/Card'
// import Carousel from 'components/Carousel'
import { useIsDarkMode } from 'state/user/hooks'
import BgLight from 'assets/images/bg_light.png'
import BgDark from 'assets/images/bg_dark.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useStatisticsOverviewData, useTopPoolsList, useTopTokensList } from 'hooks/useStatBacked'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { formatMillion } from 'utils'
import { PoolPairType, ShowTopPoolsCurrencyBox } from 'pages/Statistics'
import Swiper from 'components/Swiper'
import TestnetV3Mark from 'components/TestnetV3Mark'

const defaultPageSize = 9

export default function Explore() {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  // const isDarkMode = useIsDarkMode()
  const { result: statisticsGlobalTVL } = useStatisticsOverviewData()
  const { result: listNFT, loading: listNFTTLoading } = useTopTokensList({
    chainId: chainId || NETWORK_CHAIN_ID,
    defaultMode: Mode.ERC721,
    defaultPageSize,
    showNFT: true
  })

  const CollectionList: CollectionsProp[] = useMemo(
    () =>
      listNFT.map((item: any) => ({
        isCollection: true,
        title: item.token.name || '-',
        imgPath: item.token.logo,
        price: item.price,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.explorer + `/${item.token.type}/${chainId}/${item.token.address}/${item.token.tokenId || 0}`,
        percentage: ''
      })),
    [chainId, listNFT]
  )
  const { result: listNFTPool, loading: listNFTPoolLoading } = useTopPoolsList({
    chainId: chainId || NETWORK_CHAIN_ID,
    token: undefined,
    poolPairType: PoolPairType.ERC20_ERC721,
    token1155Id: undefined,
    defaultPageSize: defaultPageSize,
    showNFT: true
  })

  const CollectionPoolList: CollectionsProp[] = useMemo(
    () =>
      listNFTPool.map((item: any) => ({
        title: (
          <ShowTopPoolsCurrencyBox
            chainId={chainId || NETWORK_CHAIN_ID}
            pair={item.pair}
            token0Info={item.token0}
            token1Info={item.token1}
            color={'#FFFFFF'}
            key={0}
          />
        ),
        imgPath: item.token0.type !== Mode.ERC20 ? item.token0.logo : item.token1.logo,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.statisticsPools + `/${chainId}/${item.pair || item.id}`,
        percentage: '',
        addresss: [item.token0.address, item.token1.address]
      })),
    [chainId, listNFTPool]
  )
  return (
    <Box
      // maxWidth={theme.width.maxContent}
      sx={{
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
        backgroundSize: '100% 100%'
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={listNFTTLoading || listNFTPoolLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          padding: {
            xs: 0,
            md: '60px 0px 0px 45px'
          },
          display: 'flex',
          gap: 32,
          justifyContent: 'space-between',
          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        <Box sx={{ maxWidth: 724, width: '100%', padding: { xs: '20px 15px', md: 0 } }}>
          <SocilaMediaGroup />
          <Typography variant="h1" sx={{ mt: 40 }}>
            Incredible liquidity pool! Quickly find real-time value of NFTs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 20, mt: 48, flexDirection: { xs: 'column', md: 'row' } }}>
            <NumericCard
              title="Total Liquidity"
              value={statisticsGlobalTVL ? formatMillion(statisticsGlobalTVL.totalTvl, '', 2) : '--'}
            />
            <NumericCard
              title="Total Volume"
              value={statisticsGlobalTVL ? formatMillion(statisticsGlobalTVL.totalVolume, '', 2) : '--'}
            />
          </Box>
        </Box>
        <CollectionHighLight collections={CollectionList.slice(0, 3)} />
      </Box>
      <CollectionListing collections={CollectionList} title="Popular Collection" dark />
      <CollectionListing collections={CollectionPoolList} title="Top Liquidity Pool" />
    </Box>
  )
}

const SocilaMediaBtn = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRadius: 8,
  width: 44,
  height: 44,
  '&:hover': {
    opacity: 0.8
  }
}))

function SocilaMediaGroup() {
  const isDark = useIsDarkMode()

  return (
    <Box sx={{ display: 'flex', gap: 20 }}>
      <ExternalLink href={ExternalLinks.twitter}>
        <SocilaMediaBtn>{isDark ? <TwitterLight /> : <Twitter />}</SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.discord}>
        <SocilaMediaBtn>{isDark ? <DiscordLight /> : <Discord />}</SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.website}>
        <SocilaMediaBtn>{isDark ? <WebsiteLight /> : <Website />}</SocilaMediaBtn>
      </ExternalLink>
    </Box>
  )
}

function NumericCard({ title, value }: { title: string; value: string }) {
  return (
    <Card padding="28px 24px" light>
      <Box sx={{ width: '100%', maxWidth: 320 }}>
        <Typography variant="h5" sx={{ fontSize: 24, fontWeight: 700 }}>
          ${value}
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 400, mt: 16, color: theme => theme.palette.text.secondary }}>
          {title}
        </Typography>
      </Box>
    </Card>
  )
}

function CollectionHighLight({ collections }: { collections: CollectionsProp[] }) {
  const isDarkMode = useIsDarkMode()
  const isDownMd = useBreakpoint('md')
  const navigate = useNavigate()

  const items = useMemo(() => {
    return collections.map((collection, index: number) => (
      <Box key={index} onClick={() => navigate(collection.route)} sx={{ cursor: 'pointer' }}>
        <Box
          component="img"
          sx={{
            height: isDownMd ? 218 : 460,
            display: 'block',
            maxWidth: isDownMd ? 180 : 380,
            overflow: 'hidden',
            width: isDownMd ? 180 : 380,
            borderRadius: '24px'
          }}
          src={collection.imgPath}
          alt={'Token logo'}
        />
      </Box>
    ))
  }, [collections, isDownMd, navigate])

  return (
    <Box
      sx={{
        padding: '20px 0 48px',
        borderRadius: { xs: 0, md: '48px 0 0 0' },
        backgroundImage: `url(${isDarkMode ? BgDark : BgLight})`,
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: 'fit-content',
          fontSize: 16,
          fontWeight: 700,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          marginLeft: 'auto',
          marginRight: 20,
          padding: 14,
          mb: 24
        }}
      >
        Popular Collection
      </Box>
      <Box maxWidth={700}>
        <Swiper darkMode pagePosition="center" itemWidth={isDownMd ? 180 : 380} items={items} centeredSlides />
      </Box>
    </Box>
  )
}

interface CollectionsProp {
  title: string | JSX.Element
  route: string
  imgPath: string
  amount: string
  percentage: string
  price?: string
  isCollection?: boolean
  addresss?: string[]
}

function CollectionListing({
  title,
  dark,
  collections
}: {
  title: string
  dark?: boolean
  collections: CollectionsProp[]
}) {
  const isDownMd = useBreakpoint('md')
  const navigate = useNavigate()
  const items = collections.map(
    ({ title, imgPath, amount, percentage, route, addresss, price, isCollection }, index: number) => (
      <Box
        key={index}
        sx={{
          position: 'relative',
          height: isCollection ? 300 : 280,
          maxWidth: 218,
          width: 218,
          borderRadius: '12px',
          backgroundColor: dark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(207, 207, 207, 0.41)',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={() => navigate(route)}
      >
        <Box
          sx={{
            position: 'absolute',
            right: 10,
            top: 10
          }}
        >
          <TestnetV3Mark addresss={addresss || []} />
        </Box>
        <Box
          component="img"
          sx={{
            height: 168,
            display: 'block',
            width: '100%',
            objectFit: 'cover'
          }}
          src={imgPath}
          alt={'Token logo'}
        />
        <Box sx={{ padding: 16 }}>
          <Typography
            sx={{
              mb: isCollection ? 10 : 15,
              color: dark ? '#FFFFFF' : '#333333',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)', mb: 5 }}>
            Total Liquidity
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              alignItems: 'flex-end',
              ...(isCollection && { mt: 10, mb: 10 })
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: dark ? '#FFFFFF' : '#333333' }}>
              {amount}
            </Typography>
            <Typography sx={{ fontSize: 14, color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)' }}>
              {percentage}
            </Typography>
          </Box>
          {isCollection && (
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', mt: 2 }}>
              Price: {formatMillion(Number(price) || 0, '$ ', 2)}
            </Typography>
          )}
        </Box>
      </Box>
    )
  )

  return (
    <Box
      sx={{
        padding: '33px 45px',
        background: dark ? '#110E12' : '#FFFFFF',
        position: 'relative'
      }}
    >
      {isDownMd ? (
        <Typography
          variant="h5"
          sx={{ fontSize: 16, mb: 32 }}
          fontWeight={700}
          color={dark ? '#FFFFFF' : '#333333'}
          mb={56}
        >
          {title}
        </Typography>
      ) : (
        <Box
          sx={{
            height: 70,
            width: 800,
            background: dark ? '#110E12' : '#FFFFFF',
            position: 'absolute',
            top: -60,
            left: 0,
            borderRadius: '0 70px 0 0',
            padding: '33px 45px'
          }}
        >
          <Typography variant="h5" sx={{ fontSize: 32, mb: 56 }} fontWeight={700} color={dark ? '#FFFFFF' : '#333333'}>
            {title}
          </Typography>
        </Box>
      )}

      {/* <Carousel itemWidth={218} items={items} stepperPosition="right" stepperDark={!dark} /> */}

      <Swiper itemWidth={218} items={items} darkMode={dark} />
    </Box>
  )
}
