import { Box, Typography, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Axios } from 'utils/axios'
import { TestnetNFTSwapDataProp, useTestnetNFTSwapData } from 'hooks/useTestnetBacked'
import Pencil from 'assets/images/pencil.png'

function TaskItem({
  title,
  completed,
  rightText,
  to,
  style
}: {
  title: string | JSX.Element
  completed: boolean
  rightText?: string
  to?: () => void
  style?: React.CSSProperties | undefined
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      style={style}
      sx={{
        height: { xs: 'auto', sm: 52 },
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius + 'px',
        opacity: completed ? 0.5 : 1,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: { xs: '6px 20px 16px 20px', sm: '16px 20px' }
      }}
    >
      <Typography fontSize={16} fontWeight={600} mr={10} sx={{ mt: { xs: 10, sm: 0 } }} component="div">
        {completed ? <s>{title}</s> : title}
      </Typography>
      {completed ? (
        <Box display={'flex'} alignItems="center" sx={{ mt: { xs: 10, sm: 0 } }}>
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
          onClick={to ? to : () => navigate(routes.swap)}
          sx={{
            cursor: 'pointer',
            mt: { xs: 10, sm: 0 }
          }}
        >
          <Typography mr={10} fontWeight={600} color={theme.palette.info.main}>
            {rightText || 'To Finish'}
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

function PairCheck({ account }: { account: string | undefined }) {
  const [isFin, setIsFin] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!account) {
      setIsFin(false)
      return
    }
    Axios.get('/checkLpByAddress', { address: account })
      .then(res => {
        if (res.data?.data) {
          setIsFin(true)
        } else {
          setIsFin(false)
        }
      })
      .catch(() => setIsFin(false))
  }, [account])

  return <TaskItem title="Become Pool LP Test-NFT/Test Token pair" completed={isFin} to={() => navigate(routes.pool)} />
}

function NFTTransCheck({
  swapTokens,
  type
}: {
  swapTokens: TestnetNFTSwapDataProp[] | undefined
  type: 'ERC721' | 'ERC1155'
}) {
  const buyCompleted = useMemo(
    () => (swapTokens ? swapTokens.filter(item => item.buyToken === type).length > 0 : false),
    [swapTokens, type]
  )
  const sellCompleted = useMemo(
    () => (swapTokens ? swapTokens.filter(item => item.sellToken === type).length > 0 : false),
    [swapTokens, type]
  )

  return (
    <>
      <TaskItem title={`Finish at least 1 ${type} BUY`} completed={buyCompleted} />
      <TaskItem title={`Finish at least 1 ${type} SELL`} completed={sellCompleted} />
    </>
  )
}

export default function TaskBox() {
  const { account } = useActiveWeb3React()
  const theme = useTheme()
  const NFT721SwapData = useTestnetNFTSwapData(account || undefined, 2)
  const NFT1155SwapData = useTestnetNFTSwapData(account || undefined, 1)

  return (
    <>
      <PairCheck account={account || undefined} />
      <NFTTransCheck swapTokens={NFT721SwapData} type="ERC721" />
      <NFTTransCheck swapTokens={NFT1155SwapData} type="ERC1155" />
      <TaskItem
        style={{ border: `1px solid ${theme.palette.info.main}`, backgroundColor: 'transparent' }}
        title={
          <Box display={'flex'}>
            <Typography mr={10} color={theme.palette.info.main} fontWeight={600} fontSize={16}>
              Submit feedback
            </Typography>
            <img src={Pencil} width={20} />
          </Box>
        }
        rightText="Submit"
        completed={false}
        to={() => window.open('https://forms.gle/47YEmvHWjSjLvkiE9')}
      />
    </>
  )
}
