import { useTheme } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Divider from 'components/Divider'
import { CSSProperties } from 'react'
interface Props {
  summary: string | JSX.Element
  details: string | JSX.Element
  expanded: boolean
  onChange: () => void
  iconCssOverride?: CSSProperties
  margin?: string
  disabled?: boolean
}

export default function _Accordion(props: Props) {
  const { summary, details, onChange, expanded, iconCssOverride, margin, disabled } = props
  const theme = useTheme()

  return (
    <Accordion
      onChange={disabled ? undefined : onChange}
      sx={{
        boxShadow: 'none',
        background: theme.palette.background.default,
        borderRadius: '8px',
        padding: '16px 18px',
        margin: margin || 0,
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: `${margin} !important` || 0
        },
        '& .MuiAccordionSummary-content': {
          margin: 0,
          width: '100%',
          cursor: disabled ? 'auto' : 'pointer'
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
          ...iconCssOverride,
          display: disabled ? 'none' : 'inherit'
        }
      }}
      expanded={expanded}
    >
      <AccordionSummary
        sx={{
          fontSize: { xs: 14, md: 16 },
          userSelect: disabled ? 'none' : 'auto'
        }}
        expandIcon={<KeyboardArrowDownIcon />}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails sx={{ mt: 16 }}>
        <Divider />

        {details}
      </AccordionDetails>
    </Accordion>
  )
}
