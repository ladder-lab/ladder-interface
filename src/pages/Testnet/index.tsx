import { Box, Typography, useTheme, Button, Stack } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import round1Bg from 'assets/svg/bg/round1_bg.svg'
import round1DarkBg from 'assets/svg/bg/round1_dark_bg.svg'
import { useIsDarkMode } from 'state/user/hooks'
import TestnetV3 from './TestnetV3'
import TestnetV4 from './TestnetV4'

export const v2ActiveTimeStamp = [1669093260000, 1669697940000]

const routes = ['/round1', '/round2', '/monopoly', '/round3', '/airdrop']
const testnetNames = ['ROUND 1', 'ROUND 2', 'Monopoly', 'ROUND 3', 'AIRDROP']

export default function Testnet() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()
  const isDownMD = useBreakpoint('md')
  const { testnet } = useParams()
  const navigator = useNavigate()
  useEffect(() => {
    if (testnet == ':testnet') {
      navigator('/round3')
    }
  }, [navigator, testnet])
  const testnetIndex = testnet ? routes.indexOf(`/${testnet}`) : 4
  const roundIndex = testnetIndex === -1 ? 4 : testnetIndex

  const handleNavigation = (item: number) => {
    navigator(routes[item])
  }

  return (
    <Box sx={{ overflow: 'hidden', width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{ background: theme.palette.background.paper, width: '100%', padding: '18px 0' }}>
        <Stack
          direction={'row'}
          flexWrap="wrap"
          spacing={20}
          sx={{ width: '100%', maxWidth: '1350px', margin: '0 auto' }}
        >
          {routes.slice(0, 4).map((_, item) => (
            <Button
              sx={{
                width: 'fit-content',
                height: isDownMD ? 36 : 52,
                fontSize: { xs: 13, sm: 16 },
                fontWeight: isDownMD ? '500' : 'inherit',
                color: roundIndex === item ? (item > 2 ? 'white' : '#343739') : '#878D92',
                borderRadius: '12px',
                background: roundIndex === item ? (item > 2 ? '#1F9898 !important' : '#E4E4E4') : 'inherit',
                position: isDownMD ? 'relative' : 'inherit',
                '&:hover': {
                  boxShadow: 'unset',
                  background: item > 2 ? '#1F9898' : '#F6F6F6'
                }
              }}
              key={item}
              onClick={() => handleNavigation(item)}
              variant={roundIndex === item ? 'contained' : 'text'}
            >
              {testnetNames[item]}
              <Box
                sx={{
                  background:
                    item > 2
                      ? 'linear-gradient(96.44deg, #D8FF20 5.94%, #99F7F4 97.57%)'
                      : isDarkMode
                      ? '#828282'
                      : '#F6F6F6',
                  color: '#333333',
                  padding: '0 5px',
                  position: isDownMD ? 'absolute' : 'inherit',
                  top: '-14px',
                  right: '4px',
                  borderRadius: '4px',
                  fontSize: isDownMD ? 12 : 14,
                  ml: 5
                }}
              >
                {item > 2 ? 'live' : 'closed'}
              </Box>
            </Button>
          ))}
        </Stack>
      </Box>
      {roundIndex !== 4 && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: `calc(100vh - ${isDownMD ? theme.height.mobileHeader : theme.height.header})`,
            padding: {
              xs: '20px 16px 114px',
              md: '20px 45px 40px'
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '1350px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {roundIndex === 0 && <TestnetV1 round={1} />}
            {roundIndex === 1 && <TestnetV1 round={2} />}
            {roundIndex === 2 && <TestnetV3 />}
            {roundIndex === 3 && <TestnetV4 />}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export function TestnetV1({ round }: { round: number }) {
  const isDark = useIsDarkMode()
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundColor: isDark ? '#343739' : '#FAFAFA',
        minHeight: 360,
        backgroundImage: `url(${isDark ? round1DarkBg : round1Bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        backgroundSize: 'contain',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 15px',
        borderRadius: '16px'
      }}
    >
      <Typography textAlign={'center'} fontSize={32} fontWeight={700} color={theme.palette.text.primary}>
        Ladder Testnet Round {round}
      </Typography>
      <Typography
        mt={20}
        textAlign={'center'}
        fontSize={16}
        fontWeight={500}
        color={theme.palette.text.secondary}
      >{`The first round of Testnet has ended, don't worry, the round ${
        round + 1
      } of testing is coming soon!`}</Typography>
    </Box>
  )
}

export function StepTitle({ title, step }: { step: number | string; title: string }) {
  const theme = useTheme()
  return (
    <Box display={'flex'}>
      <Typography fontSize={16} fontWeight={600} color={theme.palette.text.secondary} mr={12}>
        Step {step}
      </Typography>
      <Typography fontSize={16} fontWeight={600}>
        {title}
      </Typography>
    </Box>
  )
}
