import { Box, Button, Stack, styled, Typography } from '@mui/material'
import React, { useState } from 'react'
import Individual from 'assets/svg/individual.svg'
import Organization from 'assets/svg/organization.svg'
import Input from '../../../components/Input'
import { ReactComponent as Upload } from 'assets/svg/upload.svg'

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
        <span color={'#C53434'}>*</span>
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
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  return (
    <Box sx={{ width: '55%' }}>
      <Stack direction={'row'} spacing={30} mt={40}>
        <Button>connect wallet</Button>
        <Button variant={'outlined'}>Verify Twitter</Button>
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
      <Button style={{ marginTop: '40px' }}>Submit</Button>
    </Box>
  )
}

function OrganizationForm() {
  const [name, setName] = useState('')
  const [web, setWeb] = useState('')
  const [telegram, setTelegram] = useState('')
  const [email, setEmail] = useState('')
  const [intro, setIntro] = useState('')
  return (
    <Box width={'55%'}>
      <Button variant={'outlined'} style={{ width: 'fit-content', marginTop: '40px' }}>
        Verify Twitter
      </Button>
      <Require title={'Upload your organization logo'}>
        <Stack direction={'row'} spacing={14.5} sx={{ display: 'flex', alignItems: 'center' }}>
          <Upload />
          <Button style={{ width: 'fit-content' }}>Upload a picture</Button>
          <Button style={{ width: 'fit-content' }}>Delete</Button>
        </Stack>
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
      <Button style={{ marginTop: '40px' }}>Submit</Button>
    </Box>
  )
}

export default function BecomePartnerNew() {
  const [currentSelected, setSelected] = useState('user')
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
        <Stack direction={'row'} spacing={20}>
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
