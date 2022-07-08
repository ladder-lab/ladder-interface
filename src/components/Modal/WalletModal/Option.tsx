import React from 'react'
import { styled, Button } from '@mui/material'
import { ExternalLink } from 'theme/components'
import LogoText from 'components/LogoText'

const GreenCircle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  '& div ': {
    height: 8,
    width: 8,
    marginRight: 8,
    backgroundColor: theme.palette.success.main,
    borderRadius: '50%'
  }
}))

export default function Option({
  link = null,
  clickable = true,
  onClick = null,
  header,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  onClick?: (() => void) | null
  header: React.ReactNode
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <>
      <Button
        variant="outlined"
        key={id}
        sx={{
          color: active ? 'transparent' : undefined,
          width: 320
        }}
        onClick={onClick ?? undefined}
        disabled={!clickable || active}
      >
        {active ? (
          <GreenCircle>
            <div />
          </GreenCircle>
        ) : null}
        <LogoText logo={icon} text={header} />
      </Button>
    </>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }
  return content
}
