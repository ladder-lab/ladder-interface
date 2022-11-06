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
import Carousel from 'components/Carousel'
import { useIsDarkMode } from 'state/user/hooks'
import BgLight from 'assets/images/bg_light.png'
import BgDark from 'assets/images/bg_dark.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useTopPoolsList, useTopTokensList } from 'hooks/useStatBacked'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { formatMillion } from 'utils'
import { PoolPairType, ShowTopPoolsCurrencyBox } from 'pages/Statistics'

const defaultPageSize = 9

export default function Explore() {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  // const isDarkMode = useIsDarkMode()

  const { result: list721, loading: list721Loading } = useTopTokensList(
    chainId || NETWORK_CHAIN_ID,
    Mode.ERC721,
    defaultPageSize
  )

  const { result: list1155, loading: list1155Loading } = useTopTokensList(
    chainId || NETWORK_CHAIN_ID,
    Mode.ERC1155,
    defaultPageSize
  )
  const ERC721Collection: CollectionsProp[] = useMemo(
    () =>
      list721.map(item => ({
        title: item.token.name || '-',
        imgPath: item.token.logo,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.explorer + `/${Mode.ERC721}/${chainId}/${item.token.address}/${item.token.tokenId || 0}`,
        percentage: ''
      })),
    [chainId, list721]
  )
  const ERC1155Collection: CollectionsProp[] = useMemo(
    () =>
      list1155.map(item => ({
        title: item.token.name || '-',
        imgPath: item.token.logo,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.explorer + `/${Mode.ERC1155}/${chainId}/${item.token.address}/${item.token.tokenId || 0}`,
        percentage: ''
      })),
    [chainId, list1155]
  )

  const { result: list721Pool, loading: list721PoolLoading } = useTopPoolsList(
    chainId || NETWORK_CHAIN_ID,
    undefined,
    PoolPairType.ERC20_ERC721,
    undefined,
    defaultPageSize
  )

  const { result: list1155Pool, loading: list1155PoolLoading } = useTopPoolsList(
    chainId || NETWORK_CHAIN_ID,
    undefined,
    PoolPairType.ERC20_ERC1155,
    undefined,
    defaultPageSize
  )
  const pool721Collection: CollectionsProp[] = useMemo(
    () =>
      list721Pool.map(item => ({
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
        route: routes.statisticsPools + `/${chainId}/${item.pair}`,
        percentage: ''
      })),
    [chainId, list721Pool]
  )

  const pool1155Collection: CollectionsProp[] = useMemo(
    () =>
      list1155Pool.map(item => ({
        title: (
          <ShowTopPoolsCurrencyBox
            chainId={chainId || NETWORK_CHAIN_ID}
            pair={item.pair}
            token0Info={item.token0}
            token1Info={item.token1}
            key={0}
          />
        ),
        imgPath: item.token0.type !== Mode.ERC20 ? item.token0.logo : item.token1.logo,
        amount: `${formatMillion(Number(item.tvl), '$ ', 2)}`,
        route: routes.statisticsPools + `/${chainId}/${item.pair}`,
        percentage: ''
      })),
    [chainId, list1155Pool]
  )

  return (
    <Box
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
        open={list1155PoolLoading || list721Loading || list721PoolLoading || list1155Loading}
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
            <NumericCard title="Total Liquidity" value={'1,732,654,325'} />
            <NumericCard title="Volume(24hrs)" value={'1,732,654,325'} />
          </Box>
        </Box>
        <CollectionHighLight collections={ERC721Collection.slice(0, 3)} />
      </Box>
      <CollectionListing collections={ERC721Collection} title="Popular ERC721 Collection" dark />
      <CollectionListing collections={ERC1155Collection} title="Popular ERC1155 Collection" />
      <CollectionListing collections={pool721Collection} title="Top ERC-721 Liquidity Pool" dark />
      <CollectionListing collections={pool1155Collection} title="Top ERC-1155 Liquidity Pool" />
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
      <Carousel itemWidth={isDownMd ? 180 : 380} items={items} maxWidth={700} />
    </Box>
  )
}

interface CollectionsProp {
  title: string | JSX.Element
  route: string
  imgPath: string
  amount: string
  percentage: string
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

  const items = collections.map(({ title, imgPath, amount, percentage, route }, index: number) => (
    <Box
      key={index}
      sx={{
        height: 280,
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
        component="img"
        sx={{
          height: 168,
          display: 'block',
          width: '100%',
          objectFit: 'contain'
        }}
        src={imgPath}
        alt={'Token logo'}
      />
      <Box sx={{ padding: 16 }}>
        <Typography sx={{ mb: 21, color: dark ? '#FFFFFF' : '#333333' }}>{title}</Typography>
        <Typography sx={{ color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)' }}>
          Total Liquidity
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: dark ? '#FFFFFF' : '#333333' }}>{amount}</Typography>
          <Typography sx={{ fontSize: 14, color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)' }}>
            {percentage}
          </Typography>
        </Box>
      </Box>
    </Box>
  ))

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

      <Carousel itemWidth={218} items={items} stepperPosition="right" stepperDark={!dark} />
    </Box>
  )
}
