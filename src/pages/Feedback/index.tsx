import { ArrowBack, UploadOutlined } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  ImageList,
  ImageListItem,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import { AxiosResponse } from 'axios'
import Input from 'components/Input'
import InputLabel from 'components/Input/InputLabel'
import { useActiveWeb3React } from 'hooks'
import useBreakpoint from 'hooks/useBreakpoint'
import { FeedbackInfoProp, useFeedbackInfo } from 'hooks/useTestnetV2'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { baseURL } from 'utils/axios'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'

const StyledUploadLabel = styled('label')(({ theme }) => ({
  padding: '8px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.primary.main}`
}))

export default function Feedback() {
  const theme = useTheme()
  const isDownMD = useBreakpoint('md')
  const { account } = useActiveWeb3React()
  const { data, commit } = useFeedbackInfo(account || undefined)

  useEffect(() => {
    if (!account) window.history.go(-1)
  }, [account])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: `calc(100vh - ${isDownMD ? theme.height.mobileHeader : theme.height.header})`,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: '40px auto'
        }}
      >
        <Box
          sx={{
            cursor: 'pointer'
          }}
          display={'flex'}
          fontWeight={700}
          onClick={() => window.history.go(-1)}
        >
          <ArrowBack sx={{ mr: 8 }} />
          Go back
        </Box>
        {data && <Form commitData={data} commit={commit} />}
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={!data}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

function Form({
  commitData,
  commit
}: {
  commitData: FeedbackInfoProp
  commit: (formData: FormData) => Promise<AxiosResponse<any, any> | undefined>
}) {
  const { account } = useActiveWeb3React()
  const { showModal } = useModal()
  const [fileList, setFileList] = useState<FileList | null>(null)
  const [email, setEmail] = useState(commitData.feedback?.email || '')
  const [description, setDescription] = useState(commitData.feedback?.description || '')
  const [summary, setSummary] = useState(commitData.feedback?.summary || '')
  const [type, setType] = useState(commitData.feedback?.type || '1')
  const isCommitted = useMemo(() => !!commitData.feedback?.email, [commitData.feedback?.email])

  const fileListNames = useMemo(() => {
    if (!fileList) return []
    const ret: string[] = []
    for (const item of fileList) {
      ret.push(item.name)
    }
    return ret
  }, [fileList])

  const commitForm = useCallback(() => {
    if (!account) return
    const formData = new FormData()
    formData.append('description', description)
    formData.append('email', email)
    formData.append('type', type)
    formData.append('summary', summary)
    if (fileList) {
      for (const item of fileList) {
        formData.append('files', item, item.name)
      }
    }

    commit(formData)
      .then(res => {
        if (res?.data?.msg === 'save success !') {
          showModal(
            <MessageBox type="success" closeAction={() => window.history.go(-1)}>
              Commit success !
            </MessageBox>
          )
        } else {
          showModal(<MessageBox type="error">{res?.data?.msg || 'Unknown error'}</MessageBox>)
        }
      })
      .catch(err => {
        showModal(<MessageBox type="error">{err?.data?.msg || 'Network error'}</MessageBox>)
      })
  }, [account, commit, description, email, fileList, showModal, summary, type])

  const [showError, setShowError] = useState(false)

  const error = useMemo(() => {
    return {
      email:
        !/^[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4}(,[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{2,4})*$/.test(
          email
        ),
      summary: !summary.trim(),
      description: !description.trim()
    }
  }, [description, email, summary])

  return (
    <Stack
      spacing={20}
      sx={{
        maxWidth: 800,
        margin: '40px auto'
      }}
    >
      <Input
        readOnly={isCommitted}
        value={email}
        error={showError && error.email}
        subStr={showError && error.email ? 'Email Required' : ''}
        label="Email"
        onChange={e => setEmail(e.target.value)}
        requiredLabel
      />
      <Box>
        <InputLabel required>Type</InputLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={type}
          onChange={e => setType(e.target.value)}
          name="radio-buttons-group"
        >
          <FormControlLabel disabled={isCommitted} value="1" control={<Radio />} label="Bug fixing" />
          <FormControlLabel disabled={isCommitted} value="2" control={<Radio />} label="UI Issues" />
          <FormControlLabel disabled={isCommitted} value="3" control={<Radio />} label="Recommendation" />
        </RadioGroup>
      </Box>
      <Input
        value={summary}
        error={showError && error.summary}
        subStr={showError && error.summary ? 'Summary Required' : ''}
        readOnly={isCommitted}
        onChange={e => setSummary(e.target.value)}
        label="Summary"
        requiredLabel
      />
      <Input
        value={description}
        error={showError && error.description}
        subStr={showError && error.description ? 'Description Required' : ''}
        readOnly={isCommitted}
        onChange={e => setDescription(e.target.value)}
        label="Description"
        requiredLabel
      />
      <Box>
        <InputLabel>Upload Screenshot</InputLabel>
        <Stack spacing={6} mb={10}>
          {fileListNames.map(item => (
            <Typography key={item}>{item}</Typography>
          ))}
        </Stack>
        {isCommitted ? (
          <ImageList cols={3}>
            {commitData.links.map(item => (
              <ImageListItem key={item.id}>
                <img
                  style={{ maxHeight: 200, objectFit: 'contain' }}
                  src={baseURL.replace(/\/web\/$/, '') + item.links}
                  alt={''}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <StyledUploadLabel>
            <UploadOutlined /> Upload files
            <form className="form">
              <input
                style={{ width: 0, height: 0 }}
                type="file"
                onChange={e => {
                  console.log(e)
                  setFileList(e.target.files)
                }}
                name="files"
                id="inputs"
                accept="image/*"
                multiple
              />
            </form>
          </StyledUploadLabel>
        )}
      </Box>

      <Button
        sx={{ height: 50 }}
        disabled={isCommitted}
        onClick={() => {
          setShowError(true)
          if (error.email || error.summary || error.description) {
            return
          }
          commitForm()
        }}
      >
        {isCommitted ? 'Committed' : 'Commit'}
      </Button>
    </Stack>
  )
}
