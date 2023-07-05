import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const questionList = [
  ['1. Who can participate in this R1 Testnet', 'Planning'],
  ['2. What happens after R1 testnet?', 'Planning'],
  ['3. What is a Ladder?', 'Slogan/Introduction'],
  ['4. Where can I see upcoming event updates?', 'social link entry']
]

export default function QuestionList() {
  return (
    <Box width={'100%'} maxWidth={theme => theme.width.maxContent} margin="40px auto 0" padding={24}>
      <Typography fontSize={24} fontWeight={500} mb={20} variant="h5">
        Q&A
      </Typography>
      <Box>
        {questionList.map(q => {
          return (
            <Accordion
              key={q[0]}
              disableGutters
              elevation={0}
              sx={{
                '&:before': {
                  display: 'none'
                }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography margin={'20px 24px'} fontSize={20} fontWeight={700}>
                  {q[0]}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography margin={'0px 24px 40px'} color="#747678" fontSize={16}>
                  {q[1]}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>
    </Box>
  )
}
