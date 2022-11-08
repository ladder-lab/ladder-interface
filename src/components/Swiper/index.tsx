// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { ReactComponent as SwiperLeft } from 'assets/svg/swiper_left.svg'
import { ReactComponent as SwiperLeftDark } from 'assets/svg/swiper_left_dark.svg'
import { ReactComponent as SwiperRight } from 'assets/svg/swiper_right_dark.svg'
import { ReactComponent as SwiperRightDark } from 'assets/svg/swiper_right.svg'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// import required modules
import { Autoplay, Pagination } from 'swiper'
import { Box, Stack, styled } from '@mui/material'
import { useState } from 'react'

const StyledSwiper = styled('div')(({ itemWidth }: { itemWidth?: string | number }) => ({
  '& .swiper-slide': {
    width: itemWidth || 'auto'
  }
}))

const StyledPage = styled(Box)(({ darkMode }: { darkMode?: boolean }) => ({
  fontSize: 0,
  '& svg': {
    cursor: 'pointer'
  },
  '& .swiper-pagination-my': {
    display: 'flex',
    alignItems: 'center',
    '& .swiper-pagination-bullet': {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)'
    },
    '& .swiper-pagination-bullet-active': {
      backgroundColor: darkMode ? '#fff' : '#000'
    }
  }
}))

export default function CarouselSwiper({
  itemWidth,
  items,
  darkMode,
  centeredSlides,
  pagePosition
}: {
  itemWidth: number
  items: JSX.Element[]
  darkMode?: boolean
  centeredSlides?: boolean
  pagePosition?: 'center'
}) {
  const [thisSwiper, setThisSwiper] = useState<any>(null)
  const [isBegin, setIsBegin] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  return (
    <StyledSwiper itemWidth={itemWidth}>
      <Swiper
        onSwiper={swiper => setThisSwiper(swiper)}
        slidesPerView={'auto'}
        centeredSlides={centeredSlides || false}
        spaceBetween={20}
        pagination={{ clickable: true, el: '.swiper-pagination-my', type: 'bullets' }}
        onSlideChange={swiper => {
          setIsBegin(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
        autoplay={true}
        modules={[Autoplay, Pagination]}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{item}</SwiperSlide>
        ))}
        <StyledPage
          darkMode={darkMode}
          padding="40px 0"
          display="flex"
          flexDirection={'row-reverse'}
          justifyContent={pagePosition}
        >
          <Stack spacing={20} direction={'row'}>
            <Box sx={{ opacity: isBegin ? 0.6 : 1 }} onClick={() => thisSwiper?.slidePrev()}>
              {darkMode ? <SwiperLeft /> : <SwiperLeftDark />}
            </Box>
            <Box className="swiper-pagination-my" />
            <Box sx={{ opacity: isEnd ? 0.6 : 1 }} onClick={() => thisSwiper?.slideNext()}>
              {darkMode ? <SwiperRight /> : <SwiperRightDark />}
            </Box>
          </Stack>
        </StyledPage>
      </Swiper>
    </StyledSwiper>
  )
}
