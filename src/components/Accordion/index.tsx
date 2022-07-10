import { useTheme } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
// import AddIcon from '@mui/icons-material/Add'
// import RemoveIcon from '@mui/icons-material/Remove'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Divider from 'components/Divider'
interface Props {
  summary: string | JSX.Element
  details: string | JSX.Element
  expanded: boolean
  onChange: () => void
}

export default function _Accordion(props: Props) {
  const { summary, details, onChange, expanded } = props
  const theme = useTheme()

  return (
    <Accordion
      onChange={onChange}
      sx={{
        boxShadow: 'none',
        background: theme.palette.background.default,
        borderRadius: '8px',
        padding: '16px 18px',
        '&:before': {
          display: 'none'
        },
        margin: '16px 0',
        '& .MuiAccordionSummary-content': {
          margin: '20px 0'
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
          right: 18.52,
          bottom: 18.52,
          position: 'absolute'
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
      <Divider />
      <AccordionDetails>{details}</AccordionDetails>
    </Accordion>
  )
}
