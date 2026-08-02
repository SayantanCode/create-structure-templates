import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { EmptyState } from "@/shared/ui/EmptyState";

// Generic table shell. `columns`: [{ key, label, sortable?, render?(row) }].
// A feature owns its own column definitions, toolbar, filters, and row
// actions built on top of this — this component only renders the grid plus
// sorting/selection chrome, wired to useTableState's returned state.
export function DataTable({
  columns,
  rows,
  getRowId,
  loading,
  emptyMessage = "No rows to show.",
  orderBy,
  order,
  onSort,
  selectable = false,
  selected = [],
  onToggleSelect,
  onToggleSelectAll,
  renderRowActions,
}) {
  if (loading) return <LoadingScreen />;
  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  const allSelected = selectable && rows.length > 0 && selected.length === rows.length;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.length > 0 && !allSelected}
                  onChange={() => onToggleSelectAll?.(rows.map(getRowId))}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.sortable ? (
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : "asc"}
                    onClick={() => onSort?.(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            {renderRowActions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <TableRow key={id} hover selected={selected.includes(id)}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(id)} onChange={() => onToggleSelect?.(id)} />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render ? column.render(row) : row[column.key]}</TableCell>
                ))}
                {renderRowActions && <TableCell align="right">{renderRowActions(row)}</TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
