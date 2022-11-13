import { Box, useTheme, styled, Typography } from '@mui/material'
import RankingImg from 'assets/images/testv2_user_ranking.png'
import QuestionHelper from 'components/essential/QuestionHelper'

const RowBetween = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

export default function V2Rewards() {
  const data = [
    {
      name: 'TVL',
      helperText: 'Data updated daily',
      value: '$ 8,927'
    },
    {
      name: 'Assets',
      helperText: 'Data is updated hourly',
      value: '$ 8,927'
    },
    {
      name: 'Transitions',
      helperText: 'Data is updated hourly',
      value: '7,124'
    }
  ]

  const theme = useTheme()
  return (
    <Box
      display={'grid'}
      sx={{
        gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
        mt: { md: 40, xs: 20 },
        gap: { md: '30px', xs: '20px' }
      }}
    >
      {data.map(item => (
        <Box
          key={item.name}
          sx={{
            background: `url(${RankingImg}) no-repeat`,
            padding: '6px',
            backgroundSize: '100% 100%'
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: '30px 20px',
              borderRadius: '16px'
            }}
          >
            <RowBetween>
              <Typography color={theme.palette.text.secondary} fontSize={16}>
                <RowBetween>
                  {item.name} <QuestionHelper style={{ marginLeft: 5 }} text={item.helperText} />
                </RowBetween>
              </Typography>
              <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
                {item.value}
              </Typography>
            </RowBetween>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
