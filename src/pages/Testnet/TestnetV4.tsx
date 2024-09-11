import { Box, Typography, useTheme, styled, Stack, Link } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
// import prizepool_icon from 'assets/images/prizepool.jpeg'
import V4ActivityData from './V4ActivityDataV2'
// import { ShowTopPoolsCurrencyBox } from 'pages/Statistics'
// import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
// import Copy from 'components/essential/Copy'
import { useUserHasSubmitted } from 'state/transactions/hooks'
import V4Medal from './V4ModelV2'
import CollapseWhite from '../../components/Collapse/CollapseWhite'
import { Axios, axiosInstance } from '../../utils/axios'
import {
  useCheckMakeTwitter,
  useGetRemoteStep,
  useMakeTwitter,
  useVerifyLadderOauth
} from '../../hooks/useVerifyTwitter'
import { useSignLogin } from '../../hooks/useSignIn'
import { useUserTokenCallback } from '../../state/userToken/hooks'
import { useIsWindowFocus } from 'hooks/useIsWindowVisible'
import RowBetween from '../../styled/RowBetween'
import Step0 from './TestnetSteps/Step0'
import Step1 from './TestnetSteps/Step1'
import Step2 from './TestnetSteps/Step2'
import Step3 from './TestnetSteps/Step3'
import { LeaderBoardBox } from './LeaderBoardBox'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '../../constants/routes'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import useModal from '../../hooks/useModal'
import { scrollToElement } from '../../utils'

export const StyledCardWrapper = styled(Box)(({}) => ({}))

const StyledQATitle = styled(Box)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.6,
  marginBottom: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

const StyledQABody = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.75,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

const useTwitterOAuth = (afterToken?: () => void) => {
  const { account } = useActiveWeb3React()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const code = params.get('code')
  const hasUsedCode = useRef(false)
  const { showModal } = useModal()

  const handleOnclick = useCallback(async () => {
    try {
      const res = await Axios.get('/auth/twitter/login')
      sessionStorage.removeItem('twitter')
      hasUsedCode.current = false
      window.location.href = res.data.authUrl
    } catch (e) {}
  }, [])

  const getOauthToken = useCallback(async () => {
    try {
      const { data } = await Axios.post('/auth/twitter/callback', {
        authorizationCode: code,
        walletAddress: account
      })
      sessionStorage.setItem('twitter', JSON.stringify(data.userInfo.id))
      if (afterToken) {
        setTimeout(afterToken)
      }
    } catch (e) {
      showModal(<MessageBox type="error">{e?.message || 'Failed to connect to Twitter'}</MessageBox>)
      console.warn('getOauthToken', e)
    }
  }, [code, afterToken, account])

  useEffect(() => {
    const isOauth = sessionStorage.getItem('twitter')
    if (code && !hasUsedCode.current && !isOauth) {
      getOauthToken()
      hasUsedCode.current = true
    }
  }, [code, getOauthToken])

  return {
    handleOnclick
  }
}

export default function TestnetV4() {
  const theme = useTheme()
  const isDownMD = useBreakpoint('md')
  const [step, setStep] = useState(0)
  const { token } = useUserTokenCallback()
  const { account } = useActiveWeb3React()
  const { submitted, complete } = useUserHasSubmitted(`${account}_claim4`)
  const { verifyAll, remoteStep } = useGetRemoteStep()
  const { sign, token: signToken } = useSignLogin(verifyAll)
  useEffect(() => {
    verifyAll()
  }, [account])

  const { verifyOauth, oauth } = useVerifyLadderOauth()
  const isWindowVisible = useIsWindowFocus()

  const { handleOnclick } = useTwitterOAuth(verifyAll)
  useEffect(() => {
    if (isWindowVisible) {
      setTimeout(verifyOauth, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWindowVisible])

  const location = useLocation()
  useEffect(() => {
    const targetId = location.hash.replace('#', '')
    scrollToElement(targetId)
  }, [location.hash])
  // const { makeTwitter, checkMakeTwitter } = useCheckMakeTwitter()
  const { checkMakeTwitter } = useMakeTwitter(verifyAll)
  console.log('step=>', step, oauth, submitted, complete, signToken)

  /*  useEffect(() => {
    console.log(submitted, complete)
    if (submitted || complete || !account) {
      setStep(-1)
      return
    }
    if (account) {
      if (!signToken) {
        setStep(0)
        return
      }
      if (signToken && !oauth) {
        verifyAll()
        return
      }
      if (oauth && step < 2) {
        setStep(2)
        return
      }
      if (makeTwitter && isMakeTwitter) {
        setStep(3)
        return
      }
      checkMakeTwitter()
      verifyOauth()
    }
  }, [
    account,
    checkMakeTwitter,
    complete,
    isMakeTwitter,
    makeTwitter,
    oauth,
    signToken,
    step,
    submitted,
    verifyAll,
    verifyOauth
  ])*/

  useEffect(() => {
    verifyOauth()
  }, [account, verifyOauth])

  useEffect(() => {
    setStep(remoteStep)
  }, [remoteStep])

  useEffect(() => {
    axiosInstance.defaults.headers.common['token'] = token
  }, [token])

  return (
    <Stack spacing={40}>
      <Box>
        <Typography lineHeight={1.5} fontSize={20} fontWeight={600} mb={0} onClick={handleOnclick}>
          Activity data
        </Typography>
        <V4ActivityData />
      </Box>
      <StyledCardWrapper>
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween flexWrap={'wrap'}>
              <Box display={'flex'} flexWrap={'wrap'}>
                <Typography lineHeight={1.5} fontSize={20} fontWeight={600} mr={12}>
                  Join Ladder Spring Training for Free
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Box
            flexDirection={isDownMD ? 'column' : 'row'}
            display={'flex'}
            gap={isDownMD ? 32 : 20}
            sx={{
              background: theme.palette.background.paper,
              padding: '24px 24px 32px',
              borderRadius: '12px'
            }}
          >
            <Step0 step={step} sign={sign} />
            <Step1 step={step} />
            <Step2 step={step} checkMakeTwitter={checkMakeTwitter} />
            <Step3 step={step} />
          </Box>
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper id="badge">
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography fontSize={20} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Experience more novel features of ladder!
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '12px',
              padding: isDownMD ? '24px 20px' : '24px 24px 64px'
            }}
          >
            <V4Medal />
          </Box>
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper>
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography lineHeight={1.5} fontSize={20} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Leaderboard
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <LeaderBoardBox />
        </CollapseWhite>
      </StyledCardWrapper>
      <StyledCardWrapper id="qa">
        <CollapseWhite
          defaultOpen
          title={
            <RowBetween>
              <Box display={'flex'}>
                <Typography lineHeight={1.5} fontSize={20} fontWeight={600} color={theme.palette.text.primary} mr={12}>
                  Q&A
                </Typography>
              </Box>
            </RowBetween>
          }
        >
          <Stack
            spacing={44}
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '12px',
              padding: '32px 24px'
            }}
          >
            <Box>
              <StyledQATitle>1. What is Ladder?</StyledQATitle>
              {/* <Table
                  fontSize="15px"
                  header={['Qualification', 'Source', 'Number', 'Note']}
                  rows={qaTableData}
                ></Table> */}
              <StyledQABody>
                {`Ladder is a unique AMM (Automated Market Maker) that will provide instant liquidity for NFT's including ERC-20, ERC-721, ERC-1155. `}
                <br />
                {`Unlike other NFT marketplaces which operate on an order book style of exchange, Ladder protocol takes a different approach by using Automated Market Makers and limit orders. By doing so, we aim to provide instant swaps for NFTs with low slippage and low fees!`}
                <br />
                {`On Ladder protocol, now you can see how much certainty your NFT is backed by, or swap for any NFT in the Pool, or earn a commission for providing liquidity with your NFT. `}
                <br />
                {`Ladder builds an infinite door for NFT!`}
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>2. What are the trading simulations for Spring Training?</StyledQATitle>
              <StyledQABody>
                The trading simulation will be available for all pools. Every user will begin the simulation with the
                same claimable amount of test assets. Claim yours now!
                <br />
                Training will stretch through the entire Spring season and will feature achievements for the user to
                accomplish within the simulation. Accomplishing achievements will reward points to the users allowing
                them to rank up through achievement tiers.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>3. How long will Spring Training run for?</StyledQATitle>
              <StyledQABody>
                Spring Training is an on-going seasonal event at Ladder that will continue throughout the spring season.{' '}
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>4. Which Network will Spring Training be on?</StyledQATitle>
              <StyledQABody>
                This time Spring Training will be on the SEPOLIA TEST NETWORK, we recommend getting your Test ETH from a
                faucet in advance from:
                <Link target={'_blank'} href="https://sepoliafaucet.net/">
                  https://sepoliafaucet.net/
                </Link>
                <br />
                <br />
                More detailed instructions on how to get test ETH will be pinned in our Telegram and Discord channel.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>5. How will Achievements/Rankings and Rewards work?</StyledQATitle>
              <StyledQABody>
                Completing the achievements will reward points that level you up through the achievement tiers.
                Achievement tiers make the ranking system easier for users to indicate their progress.
                <br />
                <b>Rewards will be tracked weekly and seasonally</b>
                <br />
                With rewards being tracked weekly and seasonally this means we will also be distributing rewards in
                those intervals.
                <br />
                Weekly rewards will be distributed among top ranked users based upon availability of offered reward.
                <br />
                Seasonal rewards will distribute the long awaited Ladder airdrop
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>6. What happens after Spring Training?</StyledQATitle>
              <StyledQABody>
                There will be more to expect, as in community events.
                <br />
                Stay tuned with us and don’t miss out on those incoming opportunities to win future community rewards.
              </StyledQABody>
            </Box>
            <Box>
              <StyledQATitle>7. Where can I see upcoming events?</StyledQATitle>
              <StyledQABody>
                <Box>
                  Twitter:{' '}
                  <Link target={'_blank'} href="https://twitter.com/Laddertop_NFT">
                    https://twitter.com/Laddertop_NFT
                  </Link>
                </Box>
                <Box>
                  Link3:{' '}
                  <Link target={'_blank'} href="https://link3.to/ladder">
                    https://link3.to/ladder
                  </Link>
                </Box>
                <Box>
                  Discord:{' '}
                  <Link target={'_blank'} href="https://discord.gg/sabGRPhwUM">
                    https://discord.gg/sabGRPhwUM
                  </Link>
                </Box>
              </StyledQABody>
            </Box>
          </Stack>
        </CollapseWhite>
      </StyledCardWrapper>
    </Stack>
  )
}
