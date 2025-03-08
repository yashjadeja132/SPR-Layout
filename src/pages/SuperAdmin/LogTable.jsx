import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetActivityLogsQuery } from "../../store/apiSlices/activityLogsApiSlice";
import { setPage } from "../../store/stateSlices/activityLogsStateSlice"; // Redux action for page change
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const ActivityLogsTable = () => {
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state) => state.activityLogs); // Get page and limit from Redux state
  const { data, error, isLoading } = useGetActivityLogsQuery({ page, limit }, { refetchOnMountOrArgChange: false });

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1)); // Increment page for zero-based pagination
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setPage(1)); // Reset to page 1 when rows per page changes
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error)
    return (
      <Typography variant="h6" color="error">
        Error fetching activity logs.
      </Typography>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Activity Logs
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="activity log table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.logs?.map((log, index) => (
              <TableRow key={log.id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell> {/* Format the timestamp */}
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.totalCount || 0} // Assuming totalCount is provided by your API
        rowsPerPage={limit}
        page={page - 1} // Adjust to 0-based index for MUI Pagination
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ActivityLogsTable;
