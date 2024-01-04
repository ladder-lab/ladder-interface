import { Button, useTheme } from '@mui/material'
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
  successText,
  padding
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
  padding?: string
}) {
  const theme = useTheme()

  return (
    <>
      {error || pending ? (
        <Button disabled sx={{ height, width, background: theme.palette.action.disabledBackground }}>
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
        <Button
          sx={{
            height: height ? height : '50px',
            width,
            background: theme.gradient.gradient1,
            padding: padding ?? '0 60px'
          }}
          onClick={onAction}
          disabled={disableAction}
        >
          {actionText}
        </Button>
      )}
    </>
  )
}
