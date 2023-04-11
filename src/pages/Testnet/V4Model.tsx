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
import useBreakpoint from '../../hooks/useBreakpoint'
import { useActiveWeb3React } from '../../hooks'

interface Medal {
  type: string
  desc: string
  currentAmount: number
  icons: string[]
}

export default function V4Medal() {
  const { result, milestone } = useV4Medal(ChainId.SEPOLIA)
  const isDownMD = useBreakpoint('md')
  const theme = useTheme()
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
    <Stack spacing={isDownMD ? 30 : 60}>
      <Typography
        sx={{
          background: theme.palette.background.default,
          borderRadius: '12px',
          padding: '19px 24px'
        }}
      >
        Participating in Ladder&apos;s testnet is the easiest way to secure future airdrop rewards. By joining the
        testnet, you will have an opportunity to contribute to improving our product. As a token of our appreciation, we
        will reward early users and supporters with Ladder airdrop. To make the experience more engaging and exciting
        for our community, we are offering five achievement badges as a gamification tool. Each badge has three levels,
        with higher levels offering greater chances of receiving higher airdrop rewards. Don&apos;t miss out on the
        chance to join our community, help shape the future of Ladder, and earn rewards as an early adopter!
      </Typography>
      {list.map((item, idx) => (
        <MedalRow key={idx} medal={item} curMilestone={milestone} />
      ))}
    </Stack>
  )
}

const Dot = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  width: '6px',
  height: '6px',
  borderRadius: '3px'
}))

function Line({ isDash }: { isDash: boolean }) {
  const theme = useTheme()
  return (
    <Box
      style={{
        width: '100%',
        border: isDash
          ? `1px dashed ${theme.palette.background.default}`
          : `1px solid ${theme.palette.background.default}`
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
  const { account } = useActiveWeb3React()
  const isDownMD = useBreakpoint('md')
  const theme = useTheme()
  const milestone = useMemo(() => {
    return curMilestone ? curMilestone : [1000, 2000, 3000]
  }, [curMilestone])
  const medalIcons = useMemo<{ icon: string; isColor: boolean }[]>(() => {
    if (!account) {
      return medal.icons.map(i => {
        return {
          icon: i,
          isColor: false
        }
      })
    }
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
  }, [account, medal.currentAmount, medal.icons, milestone])

  const linesDash = useMemo(() => {
    if (medal.currentAmount < milestone[1]) {
      return [true, true]
    } else if (medal.currentAmount < milestone[2]) {
      return [false, true]
    } else {
      return [false, false]
    }
  }, [medal.currentAmount, milestone])
  const imgStyle = {
    // transform: isDownMD ? 'scale(0.7)' : 'scale(1)'
    height: isDownMD ? '80%' : 'inherit',
    width: isDownMD ? '80%' : 'inherit'
  }
  return (
    <Box
      display={'flex'}
      sx={{
        flexDirection: isDownMD ? 'column' : 'row',
        alignItems: 'center'
      }}
    >
      <Box minWidth={350} pl={isDownMD ? 20 : 0} mb={isDownMD ? '22px' : '0'}>
        <Typography color={theme.palette.text.primary} fontWeight={800} fontSize={18}>
          {medal.type}
        </Typography>
        <Typography maxWidth={191} mt={11} color={'#747678'} fontSize={16}>
          {medal.desc}
        </Typography>
      </Box>
      <Box width={'100%'} position={'relative'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          {medalIcons.map((ic, idx) => {
            return (
              <Box key={idx} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                {ic.isColor ? (
                  <img src={ic.icon} alt="" style={imgStyle} />
                ) : (
                  <GrayImg src={ic.icon} alt="" style={imgStyle} />
                )}
                <Typography fontWeight={600} fontSize={12} mt={10}>
                  {(idx + 1) * 1000}
                </Typography>
              </Box>
            )
          })}
        </Box>
        <Box
          position={'absolute'}
          bottom={5}
          right={isDownMD ? 11 : 15}
          display={'flex'}
          width={'100%'}
          gap={50}
          padding={isDownMD ? '0 75px' : '0 100px'}
        >
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
