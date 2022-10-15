import { Box, Typography, useTheme } from '@mui/material'

export default function TaskItem({ completed }: { completed: boolean }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        height: { xs: 'auto', sm: 52 },
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius + 'px',
        opacity: completed ? 0.5 : 1,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px 20px'
      }}
    >
      <Typography fontSize={16} fontWeight={600} mr={10}>
        {completed ? <s>Finish at least 1 ERC 721 SELL</s> : 'Finish at least 1 ERC 721 SELL'}
      </Typography>
      {completed ? (
        <Box display={'flex'} alignItems="center">
          <Typography mr={10} fontWeight={600} color={theme.palette.info.main}>
            Completed
          </Typography>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_7887_10909)">
              <path
                d="M10 20C15.5234 20 20 15.5234 20 10C20 4.47656 15.5234 0 10 0C4.47656 0 0 4.47656 0 10C0 15.5234 4.47656 20 10 20ZM14.4141 8.16406L9.41406 13.1641C9.04688 13.5312 8.45312 13.5312 8.08984 13.1641L5.58984 10.6641C5.22266 10.2969 5.22266 9.70312 5.58984 9.33984C5.95703 8.97656 6.55078 8.97266 6.91406 9.33984L8.75 11.1758L13.0859 6.83594C13.4531 6.46875 14.0469 6.46875 14.4102 6.83594C14.7734 7.20312 14.7773 7.79687 14.4102 8.16016L14.4141 8.16406Z"
                fill="#828282"
              />
            </g>
            <defs>
              <clipPath id="clip0_7887_10909">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Box>
      ) : (
        <Box
          display={'flex'}
          alignItems="center"
          sx={{
            cursor: 'pointer'
          }}
        >
          <Typography mr={10} fontWeight={600} color={theme.palette.info.main}>
            To Finish
          </Typography>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_7887_10926)">
              <path
                d="M0 10C0 15.5234 4.47656 20 10 20C15.5234 20 20 15.5234 20 10C20 4.47656 15.5234 0 10 0C4.47656 0 0 4.47656 0 10ZM11.6016 15.0391C11.2344 15.4062 10.6406 15.4062 10.2773 15.0391C9.91406 14.6719 9.91016 14.0781 10.2773 13.7148L13.0508 10.9414L4.6875 10.9375C4.16797 10.9375 3.75 10.5195 3.75 10C3.75 9.48047 4.16797 9.0625 4.6875 9.0625H13.0508L10.2773 6.28906C9.91016 5.92188 9.91016 5.32812 10.2773 4.96484C10.6445 4.60156 11.2383 4.59766 11.6016 4.96484L15.9766 9.33594C16.3437 9.70312 16.3437 10.2969 15.9766 10.6602L11.6016 15.0391Z"
                fill="#1F9898"
              />
            </g>
            <defs>
              <clipPath id="clip0_7887_10926">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Box>
      )}
    </Box>
  )
}
