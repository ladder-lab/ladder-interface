import { Box, Button, Stack, styled, Typography } from '@mui/material'
import React, { useMemo, useRef, useState } from 'react'
import Individual from 'assets/svg/individual.svg'
import Organization from 'assets/svg/organization.svg'
import Input from '../../../components/Input'
import Upload from 'assets/svg/upload.svg'
import Web3Status from '../../../components/Header/Web3Status'
import { isNullOrEmpty, validateEmail } from '../../../utils/InputUtil'
import { Axios, testAssetUrl, testURL } from '../../../utils/axios'
import { useActiveWeb3React } from '../../../hooks'
import { useSignLogin } from '../../../hooks/useSignIn'
import { OrganProps, UserProps, useSaveAccount } from '../../../hooks/useSaveAccount'
import useBreakpoint from '../../../hooks/useBreakpoint'

const Bg = styled(Box)`
  padding: 47px 32px 80px;
  background-color: white;
  width: 91%;
  margin-top: 64px;
  border-radius: 12px;
`
const AlignCenter = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

function Require({
  width,
  title,
  children,
  mt = 40
}: {
  title: string
  children: React.ReactNode
  mt?: number | string
  width?: number | string
}) {
  return (
    <Box mt={mt} sx={{ width: width }}>
      <Typography mb={12}>
        <span style={{ color: '#C53434' }}>*</span>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function Type({
  type,
  icon,
  title,
  desc,
  setSelected,
  selected
}: {
  type: string
  icon: string
  title: string
  desc: string
  selected: boolean
  setSelected: (title: string) => void
}) {
  const Bg = styled(Box)`
    border-radius: 8px;
    padding: 40px 79px 36px 40px;
    background: ${selected ? 'linear-gradient(96.44deg, #D8FF20 5.94%, #99F7F4 97.57%)' : '#F6F6F6'};
    color: ${selected ? '#343739' : '#878D92'};
  `
  return (
    <Bg onClick={() => setSelected(type)}>
      <Box display={'flex'} alignItems={'center'}>
        <img src={icon} alt={''} />
        <Typography ml={10} fontSize={28}>
          {title}
        </Typography>
      </Box>
      <Typography mt={10}>{desc}</Typography>
    </Bg>
  )
}

function UserForm() {
  const isDownSm = useBreakpoint('sm')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const { token, sign } = useSignLogin()
  const { account } = useActiveWeb3React()
  const props: UserProps = {
    email: userEmail,
    username: userName,
    twitter: 'aaa',
    type: 1
  }
  const { save } = useSaveAccount(props)

  const userEmailErr = useMemo(() => {
    if (userEmail.length == 0) {
      return 'Please Enter Email'
    }
    if (!validateEmail(userEmail)) {
      return 'Please Enter the right email'
    }
    return ''
  }, [userEmail])
  const userNameErr = useMemo(() => {
    if (userName.length == 0) {
      return 'Please Enter Name'
    }
    return ''
  }, [userName])
  const submitDisable = useMemo<boolean>(
    () => !(isNullOrEmpty(userNameErr) && isNullOrEmpty(userEmailErr)),
    [userEmailErr, userNameErr]
  )

  const handleTwitter = async () => {
    if (!token) {
      sign()
      return
    }

    try {
      if (!account) return
      const res = await Axios.get(testURL + 'requestToken', {
        address: account
      })
      const data = res.data.msg as any
      if (!data) {
        return
      }
      window.open(
        data,
        'intent',
        'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
      )
      return
    } catch (error) {
      console.error('useAccountTestInfo', error)
    }
  }

  return (
    <Box sx={{ width: isDownSm ? '100%' : '55%' }}>
      <Stack direction={'row'} spacing={30} mt={40}>
        {!account && <Web3Status />}
        <Button variant={'outlined'} onClick={handleTwitter}>
          Verify Twitter
        </Button>
      </Stack>
      <Require title={"Applicant's email address"}>
        <Input
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder={'Please enter your address'}
        />
      </Require>
      <Require title={'Your name'}>
        <Input value={userName} onChange={e => setUserName(e.target.value)} placeholder={'Please enter your name'} />
      </Require>
      <Button
        style={{ marginTop: '40px' }}
        disabled={submitDisable}
        onClick={() => {
          save()
        }}
      >
        Submit
      </Button>
    </Box>
  )
}

const UploadInput = styled(Box)`
  position: relative;
  '&:hover': {
    cursor: pointer;
  }
`

function UploadZone({
  imageUploaded,
  setImageUploaded
}: {
  imageUploaded: string
  setImageUploaded: (url: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDownSm = useBreakpoint('sm')
  const { account } = useActiveWeb3React()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const selectedImage = e.target.files?.[0]
    console.log('selectedImage', selectedImage)
    if (selectedImage && account) {
      const formData = new FormData()
      formData.append('files', selectedImage)
      formData.append('address', account)
      Axios.post(testURL + 'uploadFile', formData)
        .then(response => {
          if (response.data.code !== 200) {
            throw response.data
          }
          setImageUploaded(response.data.msg)
        })
        .catch(error => {
          console.log('upload-img', error)
        })
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click()
  }

  const UploadPic = (
    <UploadInput>
      <label htmlFor="fileInput" onClick={handleButtonClick}>
        <img
          src={imageUploaded ? testAssetUrl + imageUploaded : Upload}
          alt="Upload"
          style={{
            width: isDownSm ? '32vw' : '8vw',
            height: isDownSm ? '32vw' : '8vw',
            borderRadius: '50%'
          }}
        />
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </UploadInput>
  )

  return (
    <Box>
      {isDownSm && UploadPic}
      <Stack direction={'row'} spacing={14.5} sx={{ display: 'flex', alignItems: 'center' }}>
        {!isDownSm && UploadPic}
        <Button style={{ width: 'fit-content' }} onClick={handleButtonClick}>
          Upload a picture
        </Button>
        <Button style={{ width: 'fit-content' }} onClick={() => setImageUploaded('')}>
          Delete
        </Button>
      </Stack>
    </Box>
  )
}

function OrganizationForm() {
  const isDownSm = useBreakpoint('sm')
  const [name, setName] = useState('')
  const [web, setWeb] = useState('')
  const [telegram, setTelegram] = useState('')
  const [email, setEmail] = useState('')
  const [intro, setIntro] = useState('')
  const [imageUploaded, setImageUploaded] = useState<string>('')
  const props: OrganProps = {
    logo: imageUploaded,
    username: name,
    website: web,
    telegram: telegram,
    email: email,
    type: 2
  }
  const { save } = useSaveAccount(props)

  const nameErr = useMemo(() => {
    if (name.length == 0) {
      return 'Please Enter name'
    }
    return ''
  }, [name])
  const webErr = useMemo(() => {
    if (web.length == 0) {
      return 'Please Enter Website url'
    }
    return ''
  }, [web])
  const telegramErr = useMemo(() => {
    if (telegram.length == 0) {
      return 'Please Enter telegram'
    }
    return ''
  }, [telegram])
  const emailErr = useMemo(() => {
    if (email.length == 0) {
      return 'Please Enter email'
    }
    return ''
  }, [email])
  const introErr = useMemo(() => {
    if (intro.length == 0) {
      return 'Please Enter intro'
    }
    return ''
  }, [intro])
  const submitDisable = useMemo<boolean>(
    () =>
      !(
        isNullOrEmpty(webErr) &&
        isNullOrEmpty(nameErr) &&
        isNullOrEmpty(telegramErr) &&
        isNullOrEmpty(emailErr) &&
        isNullOrEmpty(introErr)
      ),
    [emailErr, introErr, nameErr, telegramErr, webErr]
  )

  return (
    <Box width={isDownSm ? '100%' : '55%'}>
      <Require title={'Upload your organization logo'}>
        <UploadZone imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />
      </Require>
      <Require title={'Name of your organization'}>
        <Input
          value={name}
          placeholder={'Please enter name'}
          onChange={e => {
            setName(e.target.value)
          }}
        />
      </Require>
      <Require title={"Organization's website"}>
        <Input
          value={web}
          placeholder={'https://'}
          onChange={e => {
            setWeb(e.target.value)
          }}
        />
      </Require>
      <Require title={"Applicant's telegram ID"}>
        <Input
          value={telegram}
          placeholder={'@telegramID'}
          onChange={e => {
            setTelegram(e.target.value)
          }}
        />
      </Require>
      <Require title={"Applicant's email address"}>
        <Input
          value={email}
          placeholder={'please enter the email address'}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
      </Require>
      <Require title={"Organization's Introduction"}>
        <Input
          multiline
          height={180}
          value={intro}
          placeholder={'please enter the introduction'}
          onChange={e => {
            setIntro(e.target.value)
          }}
        />
      </Require>
      <Button style={{ marginTop: '40px' }} disabled={submitDisable} onClick={() => save()}>
        Submit
      </Button>
    </Box>
  )
}

export default function BecomePartnerNew() {
  const [currentSelected, setSelected] = useState('user')
  const isDownSm = useBreakpoint('sm')
  return (
    <Bg>
      <AlignCenter>
        <Typography variant={'h5'}>Ready to become ladder partner?</Typography>
        <Typography mt={16}>
          Thank you for applying to the Ladder Owner SBT.
          <br />
          Please fill in the form truthfully and we will keep the information provided strictly confidential.
        </Typography>
      </AlignCenter>
      <Require title={'Identity type'} mt={40}>
        <Stack direction={isDownSm ? 'column' : 'row'} spacing={20}>
          <Type
            type={'user'}
            icon={Individual}
            title={'Individual Users'}
            desc={
              'Individual users submit applications, and we will give priority to the qualifications according to the order of application after the individual ladder partner qualifications are open for application'
            }
            selected={currentSelected == 'user'}
            setSelected={setSelected}
          />
          <Type
            type={'organization'}
            icon={Organization}
            title={'Organization'}
            desc={
              'Individual users submit applications, and we will give priority to the qualifications according to the order of application after the individual ladder partner qualifications are open for application'
            }
            selected={currentSelected == 'organization'}
            setSelected={setSelected}
          />
        </Stack>
      </Require>
      {currentSelected == 'user' && <UserForm />}
      {currentSelected == 'organization' && <OrganizationForm />}
    </Bg>
  )
}
