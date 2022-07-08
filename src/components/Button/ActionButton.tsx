import { Button } from '@mui/material'
import Spinner from 'components/Spinner'
import { Typography } from '@mui/material'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
}) {
  return (
    <>
      {error || pending ? (
        <Button variant="outlined" color="primary" disabled sx={{ height, width }}>
          {pending ? (
            <>
              <Spinner marginRight={16} />
              {pendingText || 'Waiting Confirmation'}
            </>
          ) : (
            error
          )}
        </Button>
      ) : success ? (
        <Button disabled sx={{ height, width }}>
          <Typography variant="inherit">{successText ?? actionText}</Typography>
        </Button>
      ) : (
        <Button sx={{ height, width }} onClick={onAction} disabled={disableAction}>
          {actionText}
        </Button>
      )}
    </>
  )
}
