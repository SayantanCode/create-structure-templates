import { useState } from "react";

// Generic sorting/pagination/selection state for any table — a feature
// component owns its own columns/toolbar/filters/row-actions (see
// features/contacts/components/table for the reference), this hook only
// tracks the interaction state every table needs.
export function useTableState({ initialRowsPerPage = 10 } = {}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);

  function toggleSort(columnKey) {
    if (orderBy === columnKey) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(columnKey);
      setOrder("asc");
    }
  }

  function toggleSelect(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll(ids) {
    setSelected((prev) => (prev.length === ids.length ? [] : ids));
  }

  function clearSelection() {
    setSelected([]);
  }

  function handleChangePage(_event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }

  return {
    page,
    rowsPerPage,
    orderBy,
    order,
    selected,
    toggleSort,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    handleChangePage,
    handleChangeRowsPerPage,
  };
}

// Sorts + paginates a full row array client-side — for a real server-paged
// API, skip this and pass already-paged rows straight to DataTable.
export function sortAndPaginate(rows, { orderBy, order, page, rowsPerPage }) {
  const sorted = orderBy
    ? [...rows].sort((a, b) => {
        const result = a[orderBy] > b[orderBy] ? 1 : a[orderBy] < b[orderBy] ? -1 : 0;
        return order === "asc" ? result : -result;
      })
    : rows;
  return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
