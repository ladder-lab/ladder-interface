import { Box, Link, Typography, useTheme } from '@mui/material'
import bg from 'assets/images/v3_reward_bg.png'
import bg1 from 'assets/images/v3_reward_bg1.png'
import MetaBoom from 'assets/images/MetaBoom.png'
import WeirdoGhostGang from 'assets/images/WeirdoGhostGang.png'
import Furion from 'assets/images/Furion.png'
import IsekaiMetaverse from 'assets/images/Isekai Metaverse.png'
import Gritti from 'assets/images/Gritti.png'
import NextType from 'assets/images/NextType.png'
import StarryNift from 'assets/images/StarryNift.png'
import genso from 'assets/images/genso.png'
import MainLogo from 'components/MainLogo'
import { useIsDarkMode } from 'state/user/hooks'

export default function V3Rewards() {
  const theme = useTheme()
  const dark = useIsDarkMode()
  const list = [
    {
      name: 'Ladder',
      link: 'https://www.ladder.top/',
      img: ''
    },
    {
      name: 'Genso',
      link: 'https://genso.game/en/',
      img: genso
    },
    {
      name: 'MetaBoom',
      link: 'https://www.fansi.me/',
      img: MetaBoom
    },
    {
      name: 'WeirdoGhostGang',
      link: 'https://www.weirdoghost.com/',
      img: WeirdoGhostGang
    },
    {
      name: 'Furion',
      link: 'https://furion.io/',
      img: Furion
    },
    {
      name: 'Isekai Metaverse',
      link: 'https://www.isekaiprotocol.com/',
      img: IsekaiMetaverse
    },
    {
      name: 'Gritti',
      link: 'https://twitter.com/Grittiapp',
      img: Gritti
    },
    {
      name: 'NextType',
      link: 'https://twitter.com/NEXTYPE1',
      img: NextType
    },
    {
      name: 'StarryNift',
      link: 'https://starrynift.art/',
      img: StarryNift
    },
    {
      name: 'Apeiron',
      link: 'https://twitter.com/ApeironNFT',
      img: 'https://pbs.twimg.com/profile_images/1463778839914430465/Hfm1z5nH_400x400.jpg'
    },
    {
      name: 'CheersUp',
      link: 'https://twitter.com/CheersUP_NFT',
      img: 'https://pbs.twimg.com/profile_images/1562695422719787008/t1--VzCM_400x400.jpg'
    },
    {
      name: 'FPX Metaverse',
      link: 'https://twitter.com/FPX_META',
      img: 'https://pbs.twimg.com/profile_images/1613403380608827392/2fuNDTtA_400x400.jpg'
    },
    {
      name: 'WonderPal',
      link: 'https://twitter.com/WonderPals',
      img: 'https://pbs.twimg.com/profile_images/1624864585336627206/BgCZAH4d_400x400.jpg'
    }
  ]
  return (
    <Box>
      <Typography mt={10} fontSize={20} color={dark ? '#FFFFFF' : '#333333'}>
        thanks to our partners to provide the additional prizes
      </Typography>
      <Box
        sx={{
          mt: 20,
          display: 'grid',
          justifyContent: { sm: 'space-between', xs: 'center' },
          gridTemplateColumns: 'repeat(auto-fill, 240px)',
          gap: 20
        }}
      >
        {list.map((item, i) => (
          <Box
            key={i}
            sx={{
              height: 234,
              background: `url(${i === 0 ? bg1 : bg})`,
              backgroundSize: '100% 100%',
              padding: '25px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Link target={'_blank'} underline="hover" href={item.link} display={'flex'} alignItems="center">
              <Typography mr={5} noWrap maxWidth={'84%'} color={theme.palette.info.main}>
                {item.name}
              </Typography>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_9498_16481)">
                  <path
                    d="M12.6972 12.6667H3.34056V3.33333H8.01887V2H3.34056C2.59872 2 2.00391 2.6 2.00391 3.33333V12.6667C2.00391 13.4 2.59872 14 3.34056 14H12.6972C13.4323 14 14.0338 13.4 14.0338 12.6667V8H12.6972V12.6667ZM9.35553 2V3.33333H11.7548L5.18515 9.88667L6.1275 10.8267L12.6972 4.27333V6.66667H14.0338V2H9.35553Z"
                    fill="#1F9898"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_9498_16481">
                    <rect width="16.0399" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <Box height={160} display="flex" justifyContent={'center'} alignItems="center">
              {i === 0 ? <MainLogo /> : item.img ? <img style={{ width: '60%' }} src={item.img} /> : null}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
