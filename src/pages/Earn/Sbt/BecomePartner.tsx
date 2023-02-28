import { Box, Button, Grid, styled } from '@mui/material'
import Head from 'assets/svg/bg/sbt_head.png'
import { BlackText } from './index'
import { ReactComponent as Person } from 'assets/svg/sbt_person.svg'
import { ReactComponent as House } from 'assets/svg/sbt_house.svg'
import { ReactComponent as Twitter } from 'assets/svg/socials/twitter_square.svg'
import { ReactComponent as Upload } from 'assets/svg/upload.svg'
import { useState } from 'react'
import Input from '../../../components/Input'
import { LineButton, PrimaryButton } from '../../../components/Button/CustomButton'

const ContentWrapper = styled(Box)`
  background-color: white;
  width: 100%;
  display: flex;
  padding-bottom: 115px;
  flex-direction: column;
`
const HeadBox = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  padding: 120px 0 160px 0;
  align-items: center;
  background-image: url(${Head});
`

const ContentBox = styled(Box)`
  padding: 64px;
  width: 70vw;
  border-radius: 20px;
`

const RelativeBox = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: -30px;
  justify-content: center;
`

const TypeBox = styled(Box)`
  position: relative;
  width: 49%;
  background-color: #e9f5f5;
  border-radius: 20px;
  padding: 28px 0 0 24px;
`

const RowBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

function Users({ current, onSelected }: { current: number; onSelected: (type: number) => void }) {
  return (
    <TypeBox>
      <BlackText fontSize={20}>Individual users</BlackText>
      <BlackText fontSize={16}>
        Individual users submit applications, and we will give priority to the qualifications according to the order of
        application after the individual ladder partner qualifications are open for application
      </BlackText>
      {current == 0 ? (
        <LineButton
          sx={{ marginTop: '50px', marginBottom: '24px', width: 'fit-content' }}
          onClick={() => onSelected(0)}
        >
          Selected
        </LineButton>
      ) : (
        <PrimaryButton
          sx={{ marginTop: '50px', marginBottom: '24px', width: 'fit-content' }}
          onClick={() => onSelected(0)}
        >
          Select
        </PrimaryButton>
      )}
      <Box sx={{ position: 'absolute', bottom: '0px', right: '0px' }}>
        <Person />
      </Box>
    </TypeBox>
  )
}

function Organization({ current, onSelected }: { current: number; onSelected: (type: number) => void }) {
  return (
    <TypeBox>
      <BlackText fontSize={20}>Organization</BlackText>
      <BlackText fontSize={16}>
        Individual users submit applications, and we will give priority to the qualifications according to the order of
        application after the individual ladder partner qualifications are open for application
      </BlackText>
      {current == 1 ? (
        <LineButton
          sx={{ marginTop: '50px', marginBottom: '24px', width: 'fit-content' }}
          onClick={() => onSelected(1)}
        >
          Selected
        </LineButton>
      ) : (
        <PrimaryButton
          sx={{ marginTop: '50px', marginBottom: '24px', width: 'fit-content' }}
          onClick={() => onSelected(1)}
        >
          Select
        </PrimaryButton>
      )}
      <Box sx={{ position: 'absolute', bottom: '0px', right: '0px' }}>
        <House />
      </Box>
    </TypeBox>
  )
}

const TwitterBox = styled(Box)`
  display: flex;
  background-color: #f6f6f6;
  border-radius: 12px;
  padding: 10px;
  justify-content: center;
  align-items: center;
`

function TwitterBtn() {
  return (
    <TwitterBox>
      <Box>
        <Twitter />
      </Box>
      <BlackText>Verify Twitter</BlackText>
    </TwitterBox>
  )
}

function HintInput({
  title,
  isRequired,
  hint,
  value,
  setValue
}: {
  title: string
  isRequired: boolean
  hint: string
  value: string
  setValue: (value: string) => void
}) {
  return (
    <Box>
      <BlackText>
        {isRequired && <span style={{ color: '#FC1D00' }}>*</span>}
        {title}
      </BlackText>
      <Input value={value} onChange={e => setValue(e.target.value)} placeholder={hint} />
    </Box>
  )
}

function UsersForm() {
  const [inputAddress, setInputAddress] = useState('')
  const [inputName, setInputName] = useState('')
  return (
    <Grid container spacing={16}>
      <Grid item md={6}>
        <LineButton>Connect Wallet</LineButton>
      </Grid>
      <Grid item md={6}>
        <TwitterBtn />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={"Applicant's email address"}
          isRequired={true}
          hint={'Please enter your address'}
          value={inputAddress}
          setValue={setInputAddress}
        />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={'Your name'}
          isRequired={true}
          hint={'Please enter name'}
          value={inputName}
          setValue={setInputName}
        />
      </Grid>
    </Grid>
  )
}

function OrganizationForm() {
  const [inputName, setInputName] = useState('')
  const [inputWebsite, setInputWebsite] = useState('')
  const [inputTelegram, setInputTelegram] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputIntro, setInputIntro] = useState('')
  return (
    <Grid container spacing={16}>
      <Grid item md={6}>
        <BlackText>
          <span style={{ color: '#FC1D00' }}>*</span>Upload your organization logo
        </BlackText>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Upload />
          <LineButton style={{ marginLeft: '23px', width: 'max-content' }}>Upload a photo</LineButton>
        </Box>
      </Grid>
      <Grid item md={6}>
        <TwitterBtn />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={'Name of your organization'}
          isRequired={true}
          hint={'Please enter name'}
          value={inputName}
          setValue={setInputName}
        />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={"Organization's website"}
          isRequired={true}
          hint={'https://'}
          value={inputWebsite}
          setValue={setInputWebsite}
        />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={"Applicant's telegram ID"}
          isRequired={true}
          hint={'@telegramID'}
          value={inputTelegram}
          setValue={setInputTelegram}
        />
      </Grid>
      <Grid item md={6}>
        <HintInput
          title={"Applicant's email address"}
          isRequired={true}
          hint={'https://'}
          value={inputEmail}
          setValue={setInputEmail}
        />
      </Grid>
      <Grid item md={12}>
        <HintInput
          title={"Organization's Introduction*"}
          isRequired={true}
          hint={'Please enter name'}
          value={inputIntro}
          setValue={setInputIntro}
        />
      </Grid>
    </Grid>
  )
}

export default function BecomePartner() {
  const [type, setType] = useState(0) // 0 for personal ; 1 for organization
  return (
    <ContentWrapper>
      <HeadBox>
        <BlackText textAlign={'center'} fontSize={45} alignSelf={'center'} fontWeight={700}>
          Ready to Become Ladder Partner?
        </BlackText>
        <BlackText textAlign={'center'} fontSize={20}>
          Thank you for applying to the Ladder Owner SBT. Please fill in the form truthfully and we will keep
          <br /> the information provided strictly confidential.
        </BlackText>
      </HeadBox>
      <RelativeBox>
        <ContentBox sx={{ backgroundColor: '#FFFFFF', border: '1px solid #FC1D00' }}>
          <RowBox mb={60}>
            <Users current={type} onSelected={setType} />
            <Organization current={type} onSelected={setType} />
          </RowBox>
          {type == 0 && <UsersForm />}
          {type == 1 && <OrganizationForm />}
          <Button style={{ marginTop: '60px' }}>Submit</Button>
        </ContentBox>
      </RelativeBox>
    </ContentWrapper>
  )
}
