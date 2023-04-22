// Carlos Urbina 4/21/23

import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function DataGridComponent({
  rows,
  setSelectedRows,
}) {
  const handleOnSelectedRow = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const cols = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "niceFormat", headerName: "Week", width: 150 },
    { field: "java", headerName: "Java", width: 100 },
    { field: "javascript", headerName: "JavaScript", width: 100 },
    { field: "python", headerName: "Python", width: 100 },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={cols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        onRowSelectionModelChange={handleOnSelectedRow}
      />
    </Box>
  );
}
