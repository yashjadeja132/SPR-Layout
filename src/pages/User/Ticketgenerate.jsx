import React, { useState, useEffect } from "react";
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
  TablePagination,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateTicketMutation,
  useGetAllTicketsQuery,
  useDeleteTicketMutation,
} from "../../store/apiSlices/ticketApiSlice";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";

function TicketGenerate() {
  const { user } = useSelector((state) => state.auth);
  const userrole = user.role;

  const initialFormState = {
    priority: "",
    status: "",
    description: "",
    category: "",
    resolutionNotes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [createTicket] = useCreateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const { data, error, isLoading, refetch } = useGetAllTicketsQuery();

  // Refetch data whenever the modal is closed
  useEffect(() => {
    if (!openModal) {
      refetch();
    }
  }, [openModal, refetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleOpenModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setOpenModal(false);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.priority) {
      errors.priority = "Priority is required!";
    }
    if (!formData.status) {
      errors.status = "Status is required!";
    }
    if (!formData.description) {
      errors.description = "Description is required!";
    }
    if (!formData.category) {
      errors.category = "Category is required!";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateTicket = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const response = await createTicket(formData).unwrap();
      console.log("Ticket generated:", response);
      toast.success("Ticket added successfully!");
      refetch(); // Refetch data after successful ticket creation
    } catch (err) {
      console.error("Error generating ticket:", err);
    }
    handleCloseModal();
  };

  const handleOpenTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDetailModal(true);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
    setOpenDetailModal(false);
  };

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

  const paginatedTickets = data?.tickets
    ? data.tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {userrole === "user" && (
        <Button onClick={handleOpenModal} variant="contained" sx={{ mt: 2 }}>
          Generate Tickets
        </Button>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Generate Ticket
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.priority}>
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
            {formErrors.priority && (
              <FormHelperText>{formErrors.priority}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.status}>
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
            {formErrors.status && (
              <FormHelperText>{formErrors.status}</FormHelperText>
            )}
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
            error={!!formErrors.description}
            helperText={formErrors.description}
          />

          <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.category}>
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
            {formErrors.category && (
              <FormHelperText>{formErrors.category}</FormHelperText>
            )}
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

      <Modal open={openDetailModal} onClose={handleCloseTicketDetail}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Ticket Details
          </Typography>
          {selectedTicket && (
            <Box>
              <Typography>
                <strong>Priority:</strong> {selectedTicket.priority}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedTicket.status}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedTicket.description}
              </Typography>
              <Typography>
                <strong>Category:</strong> {selectedTicket.category}
              </Typography>
              <Typography>
                <strong>Assignee:</strong>{" "}
                {selectedTicket?.assigneeName || "Not assigned"}
              </Typography>
              <Typography>
                <strong>Notes:</strong> {selectedTicket.resolutionNotes}
              </Typography>
            </Box>
          )}
          <Button
            onClick={handleCloseTicketDetail}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid item>
            <Typography variant="h6">Ticket List</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Download PDF
            </Button>
          </Grid>
        </Grid>
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
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket, index) => (
                      <TableRow
                        key={ticket._id}
                        onClick={() => handleOpenTicketDetail(ticket)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell>{ticket.description}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>{ticket.resolutionNotes || "-"}</TableCell>
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
