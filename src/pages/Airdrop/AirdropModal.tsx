import { Box, Button, Typography } from '@mui/material'
import Modal from 'components/Modal'
import boxModalUrl from 'assets/images/box_modal.png'
import luckModalUrl from 'assets/images/luck_modal.png'
import boxModalUrl2 from 'assets/images/box_modal2.png'
import luckModalUrl2 from 'assets/images/luck_modal2.png'
import incompleteModalUrl from 'assets/images/incomplete_modal.png'
import useModal from 'hooks/useModal'
import { useIsDarkMode } from 'state/user/hooks'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'theme/components'
import React, { useCallback, useState } from 'react'
import MessageBox from '../../components/Modal/TransactionModals/MessageBox'
import Input from '../../components/Input'
import useBreakpoint from '../../hooks/useBreakpoint'

export default function BoxModal({ getBox, BoxId }: { getBox: () => void; BoxId?: string }) {
  const isDardMode = useIsDarkMode()
  const { hideModal } = useModal()
  const closeBox = useCallback(() => {
    hideModal()
    getBox()
  }, [hideModal, getBox])
  return (
    <Modal maxWidth="360px">
      <Box padding={24} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={isDardMode ? boxModalUrl2 : boxModalUrl} />
        <Typography variant="h5">Congrats !</Typography>
        <Typography textAlign={'center'}>
          The task has been completed!
          <br />
          Congrats on your 1 box reward!
        </Typography>
        <Button onClick={closeBox} sx={{ mt: '20px' }}>
          CLOSE
        </Button>
        {/*        <Button onClick={getBox} disabled={BoxId === 'lockLP' || BoxId === ActivityProps.Mint}>
          GET IT NOW
        </Button>*/}
      </Box>
    </Modal>
  )
}

export function IncompleteModal({
  route,
  action,
  link,
  scrollTo
}: {
  route?: string
  link?: string
  action?: () => void
  scrollTo?: string
}) {
  const { hideModal } = useModal()
  const routerScrollTo = route ? (scrollTo ? `${route}#${scrollTo}` : route) : ''
  console.log(routerScrollTo)
  return (
    <Modal maxWidth="360px">
      <Box padding={'60px 24px'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={incompleteModalUrl} />

        <Typography textAlign={'center'}>
          Your task has not been completed yet,
          <br /> Go on and finish!
        </Typography>
        {action ? (
          <Button
            onClick={() => {
              action && action()
              hideModal()
            }}
            sx={{ mt: '20px' }}
          >
            TO FINISH
          </Button>
        ) : route ? (
          <Link to={routerScrollTo ?? ''} style={{ width: '100%' }} onClick={hideModal}>
            <Button> TO FINISH </Button>
          </Link>
        ) : link ? (
          <ExternalLink href={link ?? ''} style={{ width: '100%' }}>
            <Button onClick={hideModal}> TO FINISH </Button>
          </ExternalLink>
        ) : (
          <Button onClick={hideModal} sx={{ mt: '20px' }}>
            CLOSE
          </Button>
        )}
      </Box>
    </Modal>
  )
}

export function LuckModal({ getLuck }: { getLuck: () => void }) {
  const isDardMode = useIsDarkMode()
  return (
    <Modal maxWidth="360px">
      <Box padding={24} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={20}>
        <img src={isDardMode ? luckModalUrl2 : luckModalUrl} />
        <Typography variant="h5">Congrats !</Typography>
        <Typography textAlign={'center'}>
          The task has been completed!
          <br />
          Your luck has increased by 10%.
        </Typography>
        <Button onClick={getLuck}>GET IT NOW</Button>
      </Box>
    </Modal>
  )
}

export function EmailModal() {
  const { hideModal } = useModal()
  const isDownMd = useBreakpoint('md')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.')
      return
    }
    setIsLoading(true)
    try {
      // 这里可以添加发送验证码的逻辑
      setIsCodeSent(true)
      alert('Verification code sent to your email!')
    } catch (error) {
      alert('Failed to send verification code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      alert('Code verified successfully!')
      hideModal()
    } catch (error) {
      alert('Failed to verify code.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  return (
    <Modal maxWidth="400px">
      <Box padding={24} gap={20} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
        <Typography variant="h6" align="center" gutterBottom>
          Send Verification Code
        </Typography>
        <Input
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          height={isDownMd ? 48 : 60}
        />

        <Button
          variant="contained"
          onClick={handleSendCode}
          disabled={isLoading}
          sx={{ marginBottom: 10, width: '100%' }}
        >
          {isLoading ? 'Sending...' : 'Get Code'}
        </Button>
        {isCodeSent && (
          <Input
            label="Verification Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter the code sent to your email"
          />
        )}
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading || !isCodeSent} sx={{ width: '100%' }}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Modal>
  )
}
