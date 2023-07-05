import { Box, Button, Typography, styled, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import BlindBoxUrl from 'assets/images/blind_box.png'
import QuestionHelper from 'components/essential/QuestionHelper'
import TaskList, { TYPE } from './TaskList'
import QuestionList from './QuestionList'
import { useIsDarkMode } from 'state/user/hooks'
import darkBg from 'assets/images/airdrop_bg_dark.png'
import { ReactComponent as Luck } from 'assets/svg/airdrop/luck.svg'

const StyledWrapper = styled('div', { shouldForwardProp: prop => prop !== 'isDarkMode' })<{ isDarkMode: boolean }>(
  ({ isDarkMode }) => ({
    width: '100%',
    display: 'grid',
    gap: 60,
    paddingBottom: 100,
    position: 'relative',
    backgroundImage: isDarkMode ? `url(${darkBg})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: 'right top'
  })
)

export default function Airdrop() {
  const theme = useTheme()
  const isDarkMode = useIsDarkMode()

  return (
    <StyledWrapper isDarkMode={isDarkMode}>
      <Box
        sx={{
          background: isDarkMode ? '#ffffff12' : '#ffffff32',
          display: { xs: 'grid', md: 'flex' },
          width: '100%',
          justifyContent: 'center'
        }}
        padding="60px 24px"
        gap={{ xs: 20, xl: 80 }}
      >
        <Box maxWidth={600}>
          <Typography
            fontSize={{ xs: 20, md: 36 }}
            mb={30}
            variant="h5"
            sx={{ '& span': { color: theme.palette.primary.main } }}
          >
            <span>Airdrop</span> Rules Introduction
          </Typography>
          <Typography fontSize={20} sx={{ color: theme.palette.text.secondary }}>
            Ladder airdrop is designed to reward early supporters.The more you interact with protocol the higher reward
            is expected.Full the tasks above to receive more boxes and increase your luck.
          </Typography>
          <Box
            margin="40px 0"
            display={'flex'}
            gap={40}
            sx={{
              '*': {
                color: theme.palette.primary.main
              }
            }}
          >
            <Link to={'/airdrop#qa'}>Get details</Link>
            <Link to={'/airdrop#qa'}>Q&A</Link>
          </Box>
          <Box
            sx={{
              background: isDarkMode ? '#FFFFFF20' : '#FFFFFF60',
              borderRadius: 1.2,
              padding: '10px 20px',
              textAlign: 'center'
            }}
          >
            Current Participants:{' '}
            <Typography component="span" fontWeight={700} fontSize={20}>
              4321
            </Typography>
          </Box>
        </Box>
        <Box display={{ xs: 'grid', sm: 'flex' }} gap={30}>
          <Box
            maxWidth={{ xs: '100%', md: 300 }}
            width="100%"
            sx={{
              background: isDarkMode ? '#FFFFFF20' : '#FFFFFF60',
              borderRadius: 1.2,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {' '}
            <Box width="100%" display="grid" justifyItems={'center'}>
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
                YOUR BOXES
                <QuestionHelper text="Answer" style={{ background: 'transparent' }} />
              </Typography>
              <Typography fontSize={32} fontWeight={700}>
                BOX ONE
              </Typography>
            </Box>
            <img src={BlindBoxUrl}></img>
            <Button sx={{ background: 'linear-gradient(96.44deg, #5EBDFA 5.94%, #99F7F4 97.57%)' }}>Get more</Button>
          </Box>
          <Box
            maxWidth={{ xs: '100%', md: 300 }}
            width="100%"
            sx={{
              background: isDarkMode ? '#FFFFFF20' : '#FFFFFF60',
              borderRadius: 1.2,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box width="100%" display="grid" justifyItems={'center'}>
              <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
                YOUR LUCK <QuestionHelper text="Answer" style={{ background: 'transparent' }} />
              </Typography>
              <Typography fontSize={32} fontWeight={700}>
                25%
              </Typography>
            </Box>
            <Luck />
            <Button>Boost</Button>
          </Box>
        </Box>
      </Box>
      <TaskList
        type={TYPE.box}
        data={{
          canBeDone: [
            { title: 'Add blue chip LP', chain: 11155111, completed: false },
            { title: 'Add blue chip LP', chain: 11155111, completed: true }
          ],
          completed: [],
          cannotComplete: []
        }}
      />
      <TaskList
        type={TYPE.task}
        data={{
          canBeDone: [],
          completed: [
            { title: 'Add blue chip LP', chain: 11155111, completed: false },
            { title: 'Add blue chip LP', chain: 11155111, completed: true }
          ],
          cannotComplete: []
        }}
      />
      <QuestionList />
    </StyledWrapper>
  )
}
