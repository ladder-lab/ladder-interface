import { useTheme } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
// import AddIcon from '@mui/icons-material/Add'
// import RemoveIcon from '@mui/icons-material/Remove'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Divider from 'components/Divider'
import { CSSProperties } from 'react'
interface Props {
  summary: string | JSX.Element
  details: string | JSX.Element
  expanded: boolean
  onChange: () => void
  iconCssOverride?: CSSProperties
}

export default function _Accordion(props: Props) {
  const { summary, details, onChange, expanded, iconCssOverride } = props
  const theme = useTheme()

  return (
    <Accordion
      onChange={onChange}
      sx={{
        boxShadow: 'none',
        background: theme.palette.background.default,
        borderRadius: '8px',
        padding: '16px 18px',
        margin: 0,
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: 0
        },
        '& .MuiAccordionSummary-content': {
          margin: '20px 0'
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
          ...iconCssOverride
        }
      }}
      expanded={expanded}
    >
      <AccordionSummary
        sx={{ fontSize: { xs: 14, md: 16 } }}
        expandIcon={<KeyboardArrowDownIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
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
