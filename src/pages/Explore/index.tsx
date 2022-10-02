import { Box, useTheme, IconButton, styled, Typography } from '@mui/material'
import { ReactComponent as Twitter } from 'assets/svg/socials/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/socials/discord.svg'
import { ReactComponent as Website } from 'assets/svg/socials/website.svg'
import { ExternalLink } from 'theme/components'
import { ExternalLinks } from 'constants/external_links'
import Card from 'components/Card'
import Carousel from 'components/Carousel'
import { useIsDarkMode } from 'state/user/hooks'
import BgLight from 'assets/images/bg_light.png'
import BgDark from 'assets/images/bg_dark.png'
import useBreakpoint from 'hooks/useBreakpoint'
import { useMemo } from 'react'

export default function Explore() {
  const theme = useTheme()
  // const isDarkMode = useIsDarkMode()
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
        <CollectionHighLight />
      </Box>
      <CollectionListing title="Popular ERC721 Collection" dark />
      <CollectionListing title="Top ERC-721 Liquidity Pool" />
      <CollectionListing title="Top ERC-1155 Liquidity Pool" dark />
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
  return (
    <Box sx={{ display: 'flex', gap: 20 }}>
      <ExternalLink href={ExternalLinks.twitter}>
        <SocilaMediaBtn>
          <Twitter />
        </SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.discord}>
        <SocilaMediaBtn>
          <Discord />
        </SocilaMediaBtn>
      </ExternalLink>
      <ExternalLink href={ExternalLinks.website}>
        <SocilaMediaBtn>
          <Website />
        </SocilaMediaBtn>
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

function CollectionHighLight() {
  const isDarkMode = useIsDarkMode()
  const isDownMd = useBreakpoint('md')

  const items = useMemo(() => {
    // Dummy data
    const collections = [
      {
        title: 'San Francisco – Oakland Bay Bridge, United States',
        imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60'
      },
      {
        title: 'Bird',
        imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
      },
      {
        title: 'Bali, Indonesia',
        imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250'
      }
    ]
    return collections.map((collection: any, index: number) => (
      <Box key={index}>
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
          alt={collection.title}
        />
      </Box>
    ))
  }, [isDownMd])

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
      <Carousel itemWidth={isDownMd ? 180 : 380} itemHeight={isDownMd ? 218 : 460} items={items} maxWidth={700} />
    </Box>
  )
}

function CollectionListing({ title, dark }: { title: string; dark?: boolean }) {
  const isDownMd = useBreakpoint('md')

  const collections = [
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
      amount: '$562,265.25',
      percentage: '+5.73%'
    },
    {
      title: 'Item Listed via Acution',
      imgPath: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250',
      amount: '$562,265.25',
      percentage: '+5.73%'
    }
  ]

  const items = useMemo(() => {
    return collections.map(({ title, imgPath, amount, percentage }: any, index: number) => (
      <Box
        key={index}
        sx={{
          height: 280,
          maxWidth: 218,
          width: 218,
          borderRadius: '12px',
          backgroundColor: dark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(207, 207, 207, 0.41)',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          sx={{
            height: 168,
            display: 'block'
          }}
          src={imgPath}
          alt={title}
        />
        <Box sx={{ padding: 16 }}>
          <Typography sx={{ mb: 21, color: dark ? '#FFFFFF' : '#333333' }}>{title}</Typography>
          <Typography sx={{ color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)' }}>
            Total Liquidity
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: dark ? '#FFFFFF' : '#333333' }}>
              {amount}
            </Typography>
            <Typography sx={{ fontSize: 14, color: dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 51, 51, 0.5)' }}>
              {percentage}
            </Typography>
          </Box>
        </Box>
      </Box>
    ))
  }, [isDownMd])

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
