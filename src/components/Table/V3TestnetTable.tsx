import {
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  styled,
  IconButton,
  Collapse,
  Theme
} from '@mui/material'
import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import { visuallyHidden } from '@mui/utils'

const StyledTableContainer = styled(TableContainer)(
  ({ theme, cellPadding }: { theme: Theme; cellPadding?: string }) => ({
    display: 'table',
    '& .MuiTableCell-root': {
      borderBottom: 'none',
      fontWeight: 400,
      padding: cellPadding || '10px 20px',
      // '&:first-of-type': {
      //   paddingLeft: 20
      // },
      // '&:last-child': {
      //   paddingRight: 20
      // }
      [theme.breakpoints.down('sm')]: {
        padding: '4px 10px'
      }
    },
    '& table': {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0'
    }
  })
)

const StyledTableHead = styled(TableHead)(({}) => ({
  borderRadius: 8,
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    fontSize: '14px',
    whiteSpace: 'pre',
    lineHeight: '14px',
    borderBottom: 'none'
    // '&:first-of-type': {
    //   paddingLeft: 10,
    //   borderTopLeftRadius: 8
    // },
    // '&:last-child': {
    //   paddingRight: 10,
    //   borderTopRightRadius: 8
    // }
  }
}))

const StyledTableRow = styled(TableRow, { shouldForwardProp: () => true })<{
  variant: 'outlined' | 'grey'
  fontSize?: string
  bgcolor?: string
  theme?: any
}>(({ fontSize, bgcolor, theme }) => ({
  height: 60,
  overflow: 'hidden',
  position: 'relative',
  background: bgcolor || 'unset',
  whiteSpace: 'pre',
  '& .MuiTableCell-root': {
    fontSize: (fontSize ?? '16px') + '!important',
    justifyContent: 'flex-start',
    borderColor: 'transparent',
    '& .MuiTypography-root': {
      fontSize: (fontSize ?? '16px') + '!important'
    },
    '&:first-of-type': {
      paddingLeft: '20px'
    },
    '&:last-child': {
      paddingRight: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      '&:first-of-type': {
        paddingLeft: '10px'
      },
      '&:last-child': {
        paddingRight: '10px'
      }
    }
  }
}))

export default function V3TestnetTable({
  header,
  rows,
  variant = 'grey',
  collapsible,
  hiddenParts,
  fontSize,
  bgcolors,
  // cellPadding,
  height
}: {
  header: string[]
  rows: (string | number | JSX.Element)[][]
  variant?: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenParts?: JSX.Element[]
  fontSize?: string
  bgcolors?: string[]
  cellPadding?: string
  height?: string
}) {
  return (
    <>
      {/* <StyledTableContainer cellPadding={cellPadding}> */}
      <StyledTableContainer>
        <table>
          <StyledTableHead>
            <TableRow>
              {header.map((string, idx) => (
                <TableCell key={idx}>{string}</TableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <Row
                bgcolor={bgcolors?.[idx]}
                fontSize={fontSize}
                height={height}
                row={row}
                collapsible={collapsible}
                key={row[0].toString() + idx}
                variant={variant}
                hiddenPart={hiddenParts && hiddenParts[idx]}
              />
            ))}
          </TableBody>
        </table>
      </StyledTableContainer>
    </>
  )
}

function Row({
  row,
  variant,
  collapsible,
  hiddenPart,
  fontSize,
  bgcolor,
  height
}: {
  row: (string | number | JSX.Element)[]
  variant: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenPart?: JSX.Element
  fontSize?: string
  bgcolor?: string
  height?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledTableRow
        fontSize={fontSize}
        style={{ height: height || '' }}
        variant={variant}
        bgcolor={bgcolor}
        sx={
          isOpen
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '& .MuiTableCell-root': {
                  '&:first-of-type': { borderBottomLeftRadius: 0 },
                  '&:last-child': { borderBottomRightRadius: 0 }
                }
              }
            : undefined
        }
      >
        {row.map((data, idx) => (
          <TableCell key={idx}>{data}</TableCell>
        ))}
        {collapsible && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsOpen(open => !open)}
              sx={{ flexGrow: 0 }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </StyledTableRow>
      {collapsible && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={row.length + 5}>
            <Collapse
              in={isOpen}
              timeout="auto"
              sx={{
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                width: '100%',
                marginTop: -8
              }}
            >
              <Box
                sx={{
                  padding: 28,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: '.5s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {hiddenPart}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
