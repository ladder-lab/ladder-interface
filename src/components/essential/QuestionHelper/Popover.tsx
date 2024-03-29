import { Placement } from '@popperjs/core'
import React, { useCallback, useState } from 'react'
import { usePopper } from 'react-popper'
import { lighten, styled } from '@mui/material'
import useInterval from '../../../hooks/useInterval'
import Portal from '@reach/portal'

const PopoverContainer = styled('div')(({ theme }) => ({
  zIndex: 9999,
  transition: 'visibility 150ms linear, opacity 150ms linear',
  background: lighten(theme.palette.background.paper, 0.1),
  border: 'none',
  boxShadow: '0 4px 8px 0 #33333320',
  color: theme.palette.text.primary,
  borderRadius: ' 8px'
}))

const ReferenceElement = styled('div')({
  display: 'inline-block'
})

const Arrow = styled('div')(({ theme }) => ({
  width: '8px',
  height: '8px',
  zIndex: 9998,
  '&:before': {
    position: ' absolute',
    width: '8px',
    height: '8px',
    zIndex: 9998,
    content: "''",
    boxShadow: '1px solid #33333320',
    transform: 'rotate(45deg)',
    background: theme.palette.background.paper
  },
  '&.arrow-top': {
    bottom: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },
  '&.arrow-bottom': {
    top: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },

  '&.arrow-left': {
    right: '-5px',

    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  },
  '&.arrow-right': {
    left: '-5px',
    '&:before': {
      borderTop: 'none',
      borderLeft: 'none'
    }
  }
}))

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
}

export default function Popover({ content, show, children, placement = 'auto' }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } }
    ]
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer
          ref={setPopperElement as any}
          style={styles.popper}
          {...attributes.popper}
          sx={{
            visibility: show ? 'visible' : 'hidden',
            opacity: show ? 1 : 0
          }}
        >
          {content}
          <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement as any}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  )
}
