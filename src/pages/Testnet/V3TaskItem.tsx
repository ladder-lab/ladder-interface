import { Box, Link, styled, Typography, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'
import { TestnetStatusProp } from 'hooks/useTestnetBacked'
import RankingImg from 'assets/images/testv2_user_ranking.png'
import icon1 from 'assets/svg/v3_icon1.svg'
import icon2 from 'assets/svg/v3_icon2.svg'
import Image from 'components/Image'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

function TaskItem({
  title,
  completed,
  rightText,
  img,
  to
}: {
  title: string | JSX.Element
  completed: boolean
  rightText?: string
  to?: () => void
  img: string
  style?: React.CSSProperties | undefined
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      key={title.toString()}
      sx={{
        background: `url(${RankingImg}) no-repeat`,
        padding: '2px',
        backgroundSize: '105% 105%',
        borderRadius: '15px'
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '25px',
          height: 240,
          borderRadius: '16px'
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '1fr 2fr 1fr'
          }}
        >
          <Image src={img} />
          <Typography fontSize={16} component="div" mt={10}>
            <RowBetween>{title}</RowBetween>
          </Typography>

          {completed ? (
            <Box
              sx={{
                mt: { xs: 10, sm: 0 },
                padding: '2px',
                borderRadius: '12px',
                background: 'linear-gradient(#C77DFF, #00FBD6)'
              }}
            >
              <Box
                alignSelf={'end'}
                display={'flex'}
                alignItems="center"
                justifyContent={'center'}
                sx={{
                  backgroundColor: 'white',
                  height: '100%',
                  borderRadius: '12px'
                }}
              >
                <Typography mr={10} fontWeight={600} color={theme.palette.info.main}>
                  Completed
                </Typography>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 4.5L6.75 12.75L3 9"
                    stroke="#1F9898"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            </Box>
          ) : (
            <Box
              alignSelf={'end'}
              display={'flex'}
              alignItems="center"
              onClick={to ? to : () => navigate(routes.swap)}
              sx={{
                cursor: 'pointer',
                mt: { xs: 10, sm: 0 }
              }}
            >
              <Link mr={10} fontWeight={600} color={theme.palette.info.main}>
                {rightText || 'To experience'}
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default function V3TaskItem({ testnetStatus }: { testnetStatus: TestnetStatusProp }) {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 15,
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
          lg: '1fr 1fr 1fr 1fr 1fr'
        }
      }}
    >
      <TaskItem
        title="Become Pool LP Test-NFT/Test Token pair"
        completed={testnetStatus.pairIsFin}
        to={() => navigate(routes.pool)}
        img={icon1}
      />
      <TaskItem img={icon2} title={`Finish at least 1 ERC721 BUY`} completed={testnetStatus.buy721Completed} />
      <TaskItem img={icon2} title={`Finish at least 1 ERC721 SELL`} completed={testnetStatus.sell721Completed} />
      <TaskItem img={icon2} title={`Finish at least 1 ERC1155 BUY`} completed={testnetStatus.buy1155Completed} />
      <TaskItem img={icon2} title={`Finish at least 1 ERC1155 SELL`} completed={testnetStatus.sell1155Completed} />
    </Box>
  )
}
