import React from 'react'
import { Dialog, useTheme, Box, Slide, Fade, SlideProps, FadeProps } from '@mui/material'
import useModal from 'hooks/useModal'
import { useRef } from 'react'
import { CloseIcon, BackBtn } from 'theme/components'
import useBreakpoint from 'hooks/useBreakpoint'

interface Props {
  children?: React.ReactNode
  onBack?: () => void
  closeIcon?: boolean
  width?: string
  maxWidth?: string
  isCardOnMobile?: boolean
  customIsOpen?: boolean
  customOnDismiss?: () => void
  padding?: string
  hasBorder?: boolean
  background?: string
  backdropColor?: string
  closeVariant?: 'button' | 'plain'
}

const Transition = React.forwardRef<unknown, SlideProps | FadeProps>(function Transition(props, ref) {
  const isDownSm = useBreakpoint()
  return isDownSm ? <Slide direction="up" ref={ref} {...props} /> : <Fade ref={ref} {...props} />
})

export default function Modal(props: Props) {
  const {
    children,
    onBack,
    closeIcon,
    isCardOnMobile,
    customIsOpen,
    customOnDismiss,
    hasBorder = true,
    width,
    maxWidth,
    padding,
    background,
    backdropColor,
    closeVariant
  } = props
  const { isOpen, hideModal } = useModal()
  const node = useRef<any>()
  const theme = useTheme()
  const hide = customOnDismiss ? customOnDismiss : hideModal

  return (
    <>
      <Dialog
        open={customIsOpen !== undefined ? !!customIsOpen : isOpen}
        sx={{
          '& *': {
            boxSizing: 'border-box'
          },
          '& .MuiDialog-container ': {
            alignItems: { xs: !isCardOnMobile ? 'flex-end' : 'center', sm: 'center' }
          },
          margin: '0 16px'
        }}
        TransitionComponent={Transition}
        PaperProps={{
          ref: node,
          sx: {
            ...{
              width: { xs: 'calc(100vw - 32px)!important', sm: width || 488 },
              maxWidth,
              background: theme => background ?? theme.palette.background.paper,
              border: hasBorder ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
              boxShadow: 'unset',
              padding: 0,
              boxSizing: 'border-box',
              borderRadius: '12px',
              marginBottom: { xs: 0, sm: '10vh' },
              overflowX: 'hidden',
              overflowY: 'hidden',
              position: 'absolute',
              maxHeight: theme => `calc(100vh - ${theme.height.header})`
            },
            ...(!isCardOnMobile
              ? {
                  [theme.breakpoints.down('sm')]: {
                    border: 'none',
                    width: '100%!important',
                    maxWidth: 'unset!important',
                    maxHeight: `calc(100vh - ${theme.height.mobileHeader})`,
                    height: 'auto',
                    borderRadius: '12px',
                    marginTop: theme.height.mobileHeader,
                    marginBottom: 0,
                    pb: '50px',
                    pt: '10px'
                  }
                }
              : { [theme.breakpoints.down('sm')]: { margin: 0, pb: '20px', borderRadius: '0' } })
          }
        }}
        BackdropProps={{
          sx: {
            ...{
              backgroundColor: backdropColor || 'rgba(0,0,0,0.6)',
              [theme.breakpoints.down('sm')]: { top: theme.height.mobileHeader }
            }
          }
        }}
        onClose={hide}
      >
        <Box width="100%" height="100%" position="relative" padding={padding || 0}>
          {onBack && (
            <BackBtn
              onClick={onBack}
              sx={{
                position: 'absolute',
                top: 24,
                left: 32
              }}
            />
          )}
          {closeIcon && (
            <CloseIcon
              onClick={hide}
              variant={closeVariant}
              sx={{
                position: 'absolute',
                top: {
                  xs: 20,
                  md: closeVariant === 'plain' ? 20 : 24
                },
                right: {
                  xs: 20,
                  md: closeVariant === 'plain' ? 20 : 32
                }
              }}
            />
          )}
          {children}
        </Box>
      </Dialog>
    </>
  )
}
