import * as React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import type { Props } from '@/Interfaces/Setting/OpeningHour'
import "@/Styles/Common/CustomTable.css"

export default function CustomTable<T>({ columns, rows }: Props<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper className="table__container">
      <TableContainer className="table__scroll-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  className="table__cell--header"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover key={rowIndex}>
                  {columns.map((column) => {
                    if (column.render) {
                      return (
                        <TableCell
                          key={String(column.id)}
                          align={column.align}
                          className="table__cell--body"
                        >
                          {column.render(row)}
                        </TableCell>
                      )
                    }
                    const key = column.id as keyof T
                    const value = row[key]
                    return (
                      <TableCell
                        key={String(column.id)}
                        align={column.align}
                        className="table__cell--body"
                      >
                        {typeof value === 'boolean' ? (
                          <span className={value ? 'status status--active' : 'status status--inactive'}>
                            {value ? 'Sí' : 'No'}
                          </span>
                        ) : column.format && typeof value === 'number' ? (
                          column.format(value)
                        ) : (
                          String(value ?? '')
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        className="table__pagination"
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}