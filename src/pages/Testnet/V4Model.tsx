import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import provider1 from 'assets/svg/round3/providor-1.svg'
import provider2 from 'assets/svg/round3/providor-2.svg'
import provider3 from 'assets/svg/round3/providor-3.svg'
import accumulator1 from 'assets/svg/round3/accumulator-1.svg'
import accumulator2 from 'assets/svg/round3/accumulator-2.svg'
import accumulator3 from 'assets/svg/round3/accumulator-3.svg'
import dompor1 from 'assets/svg/round3/dumpoor-1.svg'
import dompor2 from 'assets/svg/round3/dumpoor-2.svg'
import dompor3 from 'assets/svg/round3/dumpoor-3.svg'
import trador1 from 'assets/svg/round3/tradoor-1.svg'
import trador2 from 'assets/svg/round3/tradoor-2.svg'
import trador3 from 'assets/svg/round3/tradoor-3.svg'
import whale1 from 'assets/svg/round3/whale-1.svg'
import whale2 from 'assets/svg/round3/whale-2.svg'
import whale3 from 'assets/svg/round3/whale-3.svg'
import { useMemo } from 'react'
import { useV4Medal } from '../../hooks/useTestnetV4'
import { ChainId } from '../../constants/chain'

interface Medal {
  type: string
  desc: string
  currentAmount: number
  icons: string[]
}

export default function V4Medal() {
  const { result, milestone } = useV4Medal(ChainId.SEPOLIA)
  const list: Medal[] = useMemo(() => {
    return [
      {
        type: 'Lliquidity providooooor',
        desc: 'Provide liquidity to level up!',
        currentAmount: Number(result?.liquidityValume),
        icons: [provider1, provider2, provider3]
      },
      {
        type: 'Accumulatoor',
        desc: "Purchase NFT's (ERC-721) to level up!",
        currentAmount: Number(result?.buy721Valume),
        icons: [accumulator1, accumulator2, accumulator3]
      },
      {
        type: 'Dumpooor',
        desc: "Sell NFT's (721) to level up!",
        currentAmount: Number(result?.sell721Valume),
        icons: [dompor1, dompor2, dompor3]
      },
      {
        type: 'tradoooor',
        desc: "Purchase NFT's (1155) to level up!",
        currentAmount: Number(result?.buy1155Valume),
        icons: [trador1, trador2, trador3]
      },
      {
        type: 'Whale',
        desc: "Sell NFT's (1155) to level up!",
        currentAmount: Number(result?.sell1155Valume),
        icons: [whale1, whale2, whale3]
      }
    ]
  }, [
    result?.buy1155Valume,
    result?.buy721Valume,
    result?.liquidityValume,
    result?.sell1155Valume,
    result?.sell721Valume
  ])

  return (
    <Stack spacing={60}>
      {list.map((item, idx) => (
        <MedalRow key={idx} medal={item} curMilestone={milestone} />
      ))}
    </Stack>
  )
}

const Dot = styled(Box)`
  background: #e4e4e4;
  width: 6px;
  height: 6px;
  border-radius: 3px;
`

function Line({ isDash }: { isDash: boolean }) {
  return (
    <Box
      style={{
        width: '100%',
        border: isDash ? '1px dotted #e4e4e4' : '1px solid #e4e4e4'
      }}
    ></Box>
  )
}

const GrayImg = styled('img')`
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  opacity: 0.3;
`

function MedalRow({ medal, curMilestone }: { medal: Medal; curMilestone: number[] | undefined }) {
  const theme = useTheme()
  const milestone = useMemo(() => {
    return curMilestone ? curMilestone : [1000, 2000, 3000]
  }, [curMilestone])
  const medalIcons = useMemo<{ icon: string; isColor: boolean }[]>(() => {
    if (medal.currentAmount < milestone[0]) {
      return medal.icons.map(i => {
        return {
          icon: i,
          isColor: false
        }
      })
    } else if (medal.currentAmount < milestone[1]) {
      return medal.icons.map((i, idx) => {
        return {
          icon: i,
          isColor: idx < 1
        }
      })
    } else if (medal.currentAmount < milestone[2]) {
      return medal.icons.map((i, idx) => {
        return {
          icon: i,
          isColor: idx < 2
        }
      })
    } else {
      return medal.icons.map(i => {
        return {
          icon: i,
          isColor: true
        }
      })
    }
  }, [medal.currentAmount, medal.icons, milestone])

  const linesDash = useMemo(() => {
    if (medal.currentAmount < milestone[1]) {
      return [true, true]
    } else if (medal.currentAmount < milestone[2]) {
      return [false, true]
    } else {
      return [false, false]
    }
  }, [medal.currentAmount, milestone])
  return (
    <Box display={'flex'}>
      <Box minWidth={350}>
        <Typography color={theme.palette.text.primary} fontWeight={800} fontSize={18}>
          {medal.type}
        </Typography>
        <Typography mt={11} color={'#747678'} fontSize={16}>
          {medal.desc}
        </Typography>
      </Box>
      <Box width={'100%'} position={'relative'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          {medalIcons.map((ic, idx) => {
            return (
              <Box key={idx} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                {ic.isColor ? <img src={ic.icon} alt="" /> : <GrayImg src={ic.icon} alt="" />}
                <Typography fontWeight={600} fontSize={12} color={'black'} mt={10}>
                  {(idx + 1) * 1000}
                </Typography>
              </Box>
            )
          })}
        </Box>
        <Box position={'absolute'} bottom={5} right={15} display={'flex'} width={'100%'} gap={50} padding={'0 100px'}>
          {linesDash.map((isDash, idx) => {
            return (
              <Box width={'100%'} display={'flex'} alignItems={'center'} key={idx}>
                <Dot />
                <Line isDash={isDash} />
                <Dot />
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
