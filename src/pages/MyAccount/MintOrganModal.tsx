import Box from '@mui/material/Box'
import { Button, Stack, styled, Typography } from '@mui/material'
import { ReactComponent as Close } from 'assets/svg/close-btn.svg'
import Modal from '../../components/Modal'
import useBreakpoint from '../../hooks/useBreakpoint'
import { SbtListResult } from '../../hooks/useGetSbtList'
import {
  useVerifyTwitter,
  useVerifyTwitterFollow,
  useVerifyTwitterOauth,
  useVerifyTwitterRetweet
} from '../../hooks/useVerifyTwitter'
import { useMintSbt } from '../../hooks/useMintSbt'
import { useCallback, useEffect, useMemo } from 'react'
import TransacitonPendingModal from '../../components/Modal/TransactionModals/TransactionPendingModal'
import useModal from '../../hooks/useModal'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import { Axios, testURL } from '../../utils/axios'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

const StepText = styled(Typography)`
  font-size: 28px;
  font-weight: 500;
`
const GreenBtn = styled(Box)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  width: 'fit-content',
  cursor: 'pointer',
  color: 'white',
  backgroundColor: '#1F9898',
  padding: '6px 16px',
  borderRadius: '12px',
  marginRight: 8,
  ['&.active']: {
    color: theme.palette.common.white,
    backgroundColor: '#1F9898'
  }
}))

const GreenLineBtn = styled(Box)(() => ({
  fontSize: 16,
  fontWeight: 500,
  cursor: 'pointer',
  color: '#1F9898',
  backgroundColor: '#F6F6F6',
  padding: '6px 16px',
  border: '1px solid #1F9898',
  borderRadius: '12px',
  marginRight: 8
}))

export default function MintOrganModal({ hide, sbtInfo }: { hide: () => void; sbtInfo: SbtListResult }) {
  const isDownSm = useBreakpoint('sm')
  const { account, chainId } = useActiveWeb3React()
  const { verifyOauth, oauth } = useVerifyTwitterOauth(sbtInfo.contract)
  const { verifyFollow, follow } = useVerifyTwitterFollow(sbtInfo.contract)
  const { verifyRetweet, retweet } = useVerifyTwitterRetweet(sbtInfo.contract)
  const addTransaction = useTransactionAdder()
  const { showModal } = useModal()
  const { openVerify } = useVerifyTwitter()
  const { createTask } = useMintSbt()
  const followUsers = sbtInfo.twitter.split('&')
  const followUsersLink = sbtInfo.twitter_link.split('&')
  const errMsg = useMemo(() => {
    if (!oauth) {
      return 'Twitter not verify'
    }
    if (!follow) {
      return 'Need to follow all users'
    }
    if (!retweet) {
      return 'Need to retweet'
    }
    return ''
  }, [follow, oauth, retweet])

  useEffect(() => {
    verifyOauth()
  }, [verifyOauth])

  const handleMint = useCallback(async () => {
    // if (errMsg) return
    showModal(<TransacitonPendingModal pendingText="Signing" />)
    const sbt = sbtInfo.contract
    Axios.get(testURL + 'mintSign', {
      address: account,
      chainId: chainId,
      sbt: sbt
    }).then(async res => {
      console.log('mintSignthen', res)
      const contractResult = await createTask(res.data.data.inviter, sbtInfo.contract)
      addTransaction(contractResult, {
        summary: 'Mint ' + sbtInfo.name
      })
      showModal(<MessageBox type="success">Mint {sbtInfo.name} Success!</MessageBox>)
    })
  }, [account, addTransaction, chainId, createTask, sbtInfo.contract, sbtInfo.name, showModal])

  function VerifyFollowBtn() {
    return (
      <GreenLineBtn
        onClick={() => {
          verifyFollow()
        }}
      >
        {follow ? 'Verified' : 'Verify'}
      </GreenLineBtn>
    )
  }

  return (
    <Modal>
      <Box
        sx={{
          padding: '37px 20px 47px 20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <StepText>Step1</StepText>
          <Button
            sx={{
              background: 'transparent',
              width: 'fit-content',
              '&:hover': {
                background: 'transparent'
              }
            }}
            onClick={hide}
          >
            <Close />
          </Button>
        </Box>
        <Typography>Please click this button below and tweet a verification message on Twitter</Typography>
        <GreenBtn
          style={{ marginTop: '20px' }}
          onClick={() => {
            console.log('oauth', oauth)
            if (oauth) {
              console.log('oauth', true)
              return
            }
            openVerify()
          }}
        >
          {oauth ? 'Tweeted' : 'Tweet'}
        </GreenBtn>
        <StepText mt={47}>Step2</StepText>
        <Typography mt={20}>Follow Ladder and StarryNift on twitter</Typography>
        {isDownSm && <VerifyFollowBtn />}
        <Stack mt={20} direction={'row'} spacing={20}>
          {!isDownSm && <VerifyFollowBtn />}
          {followUsers.map((user, idx) => {
            return (
              <GreenBtn
                key={idx}
                onClick={() => {
                  window.open(
                    followUsersLink[idx],
                    'intent',
                    'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
                  )
                }}
              >
                Follow <span style={{ fontWeight: 800 }}>{user}</span>
              </GreenBtn>
            )
          })}
        </Stack>
        <StepText mt={47}>Step3</StepText>
        <Typography mt={20}>Retweet Ladder&apos;s tweet</Typography>
        <Stack direction={'row'} mt={20} spacing={20}>
          <GreenLineBtn
            onClick={() => {
              verifyRetweet()
            }}
          >
            {retweet ? 'Verified' : 'Verify'}
          </GreenLineBtn>
          <GreenBtn
            fontWeight={600}
            onClick={() => {
              window.open(
                sbtInfo.twiter_retweet_link,
                'intent',
                'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
              )
            }}
          >
            Retweet Now
          </GreenBtn>
        </Stack>
        <Typography color="#C53434">{errMsg}</Typography>
        <Box display={'flex'} gap={20} mt={20}>
          <Button
            onClick={() => {
              handleMint()
            }}
          >
            Mint
          </Button>
          <Button
            onClick={hide}
            style={{
              background: '#DADADA',
              borderRadius: '12px'
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
