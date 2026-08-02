import TablePagination from "@mui/material/TablePagination";

export function TablePaginationBar({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  );
}
