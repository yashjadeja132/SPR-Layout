import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateTicketMutation,
  useGetAllTicketsQuery,
  useDeleteTicketMutation,
} from "../../store/apiSlices/ticketApiSlice";

function TicketGenerate() {
  // Initial form state for creating a new ticket.
  const initialFormState = {
    priority: "",
    status: "",
    description: "",
    category: "",
    resolutionNotes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [openModal, setOpenModal] = useState(false);
  const [createTicket] = useCreateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // useGetAllTicketsQuery hook to fetch ticket data along with the refetch method.
  const { data, error, isLoading, refetch } = useGetAllTicketsQuery();

  // Generic change handler for all form inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form and open modal.
  const handleOpenModal = () => {
    setFormData(initialFormState);
    setOpenModal(true);
  };

  // Reset form and close modal.
  const handleCloseModal = () => {
    setFormData(initialFormState);
    setOpenModal(false);
  };

  // Create a new ticket and refresh the ticket list.
  const handleGenerateTicket = async () => {
    try {
      const response = await createTicket(formData).unwrap();
      console.log("Ticket generated:", response);
      // Refresh tickets list after creation.
      refetch();
    } catch (err) {
      console.error("Error generating ticket:", err);
    }
    handleCloseModal();
  };

  // Edit ticket stub function.
  const handleEditClick = (ticket) => {
    console.log("Edit ticket:", ticket);
    // Implement edit functionality as needed.
  };

  // Delete ticket function using the deleteTicket mutation.
  const handleDelete = async (ticketId) => {
    try {
      const response = await deleteTicket({ ticketId }).unwrap();
      console.log("Ticket deleted:", response);
      // Refresh tickets list after deletion.
      refetch();
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  // Modal styling.
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    width: "90%",
    maxWidth: "500px",
    outline: "none",
  };

  // Calculate the tickets to display for the current page.
  const paginatedTickets = data?.tickets
    ? data.tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  // Handle page change for pagination.
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Button onClick={handleOpenModal} variant="contained" sx={{ mt: 2 }}>
        Generate Tickets
      </Button>

      {/* Modal for creating a new ticket */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Generate Ticket
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {["Low", "Medium", "High", "Critical"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {["Open", "In Progress", "Resolved", "Closed"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="description"
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[
                "Technical Support",
                "Billing & Payment",
                "General Inquiry",
                "Feature Request",
              ].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="resolutionNotes"
            label="Notes"
            multiline
            rows={3}
            value={formData.resolutionNotes}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            onClick={handleGenerateTicket}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Generate Ticket
          </Button>

          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Ticket Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ticket List
        </Typography>
        {isLoading ? (
          <Typography>Loading tickets...</Typography>
        ) : error ? (
          <Typography>Error loading tickets.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="ticket table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Resolution Notes</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket, index) => (
                      <TableRow key={ticket._id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell>{ticket.description}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>{ticket.resolutionNotes}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(ticket)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                            Edit
                          </Button>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(ticket._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No tickets available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={data?.tickets ? data.tickets.length : 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
            />
          </>
        )}
      </Box>
    </div>
  );
}

export default TicketGenerate;
