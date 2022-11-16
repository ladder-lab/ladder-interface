import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { Loader } from 'components/AnimatedSvg/Loader'
import DelayLoading from 'components/DelayLoading'
import { useIsDarkMode } from 'state/user/hooks'

export type Order = 'asc' | 'desc'

export interface TableHeadCellsProp {
  label: string | JSX.Element
  sortValue?: string | number
  sort?: boolean
  align?: 'left' | 'center' | 'right'
}
export interface TableRowCellsProp {
  label: JSX.Element | string | number
  align?: 'left' | 'center' | 'right'
}

export default function StatTable({
  headers,
  rows,
  page,
  setPage,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  count,
  loading,
  minWidth,
  size,
  pageSize
}: {
  headers: TableHeadCellsProp[]
  rows: TableRowCellsProp[][]
  page: number
  setPage: (page: number) => void
  order?: Order
  setOrder?: (order: Order) => void
  orderBy?: string | number
  setOrderBy?: (orderBy: string | number) => void
  count: number
  pageSize: number
  loading?: boolean
  size?: 'small'
  minWidth?: number
}) {
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string | number) => {
    if (!order || !setOrder || !setOrderBy) return
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1)
  }

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10))
  //   setPage(0)
  // }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = pageSize - rows.length
  const isDarkMode = useIsDarkMode()

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, padding: '0 20px', position: 'relative' }}>
        {loading && (
          <DelayLoading loading={loading}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                // zIndex: 1,
                pt: 50,
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'
              }}
            >
              <Loader />
            </Box>
          </DelayLoading>
        )}
        <TableContainer>
          <Table
            sx={{
              minWidth: minWidth || 600,
              '& *': {
                fontWeight: 500
              }
            }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <TableHead>
              <TableRow>
                {headers.map((headCell, index) => (
                  <TableCell
                    sx={{ padding: size === 'small' ? 10 : 16 }}
                    align={headCell.align || index === 0 ? 'left' : index === headers.length - 1 ? 'right' : 'center'}
                    key={index}
                    sortDirection={headCell.sort && orderBy === headCell.sortValue ? order : false}
                  >
                    {headCell.sort && headCell.sortValue ? (
                      <TableSortLabel
                        active={orderBy === headCell.sortValue}
                        direction={orderBy === headCell.sortValue ? order : 'asc'}
                        onClick={event => handleRequestSort(event, headCell.sortValue || '')}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item1, idx1) => (
                <TableRow key={idx1}>
                  {item1.map((item2, idx2) => (
                    <TableCell
                      key={idx2}
                      sx={{ padding: size === 'small' ? 10 : 16 }}
                      align={item2.align || idx2 === 0 ? 'left' : idx2 === item1.length - 1 ? 'right' : 'center'}
                    >
                      {item2.label}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (size === 'small' ? 41 : 53) * emptyRows
                  }}
                >
                  <TableCell colSpan={6} sx={{ padding: size === 'small' ? 10 : 16 }}>
                    {emptyRows === pageSize && !loading && <Box style={{ textAlign: 'center' }}>No Data</Box>}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[pageSize]}
          component="div"
          count={count}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
