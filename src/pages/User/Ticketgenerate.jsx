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
  Divider,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  useCreateTicketMutation,
  useGetAllTicketsQuery,
  useDeleteTicketMutation,
  useAssignTicketMutation,
  useUpdateTicketMutation,
} from "../../store/apiSlices/ticketApiSlice";
import { useGetUsersQuery } from "../../store/apiSlices/usersApiSlice";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [formErrors, setFormErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffList, setStaffList] = useState([]);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const { data, error, isLoading, refetch } = useGetAllTicketsQuery();
  const { data: allUsersData } = useGetUsersQuery("staff");

  const staffData = allUsersData?.users?.filter(
    (user) => user.role === "staff"
  );

  const [createTicket] = useCreateTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();
  const [assignTicket] = useAssignTicketMutation();

  const paginatedTickets = data?.tickets
    ? data.tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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

  const handleOpenModal = (ticket = null) => {
    if (ticket) {
      setFormData({
        priority: ticket.priority,
        status: ticket.status,
        description: ticket.description,
        category: ticket.category,
        resolutionNotes: ticket.resolutionNotes,
      });
      setSelectedTicket(ticket);
    } else {
      setFormData(initialFormState);
      setSelectedTicket(null); // reset on new ticket creation
    }
    setFormErrors({});
    setOpenModal(true);
  };

  const handleUpdateTicket = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (!selectedTicket) {
      toast.error("No ticket selected for update.");
      return;
    }

    try {
      const response = await updateTicket({
        ...formData,
        ticketId: selectedTicket.ticketId,
      }).unwrap();
      console.log("Ticket updated:", response);
      refetch();
      toast.success("Ticket updated successfully!");
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Error updating ticket.");
    }
    handleCloseModal();
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      console.log(ticketId, "ticketId");
      await deleteTicket(ticketId).unwrap();
      refetch();
      toast.success("Ticket deleted successfully!");
    } catch (err) {
      console.error("Error deleting ticket:", err);
      toast.error("Error deleting ticket.");
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setOpenModal(false);
  };

  const handleGenerateTicket = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const response = await createTicket(formData).unwrap();
      console.log("Ticket generated:", response);
      refetch();
    } catch (err) {
      console.error("Error generating ticket:", err);
    }
    handleCloseModal();
  };

  const handleOpenTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDetailModal(true);
  };

  const handleCloseTicketDetail = (e) => {
    setSelectedTicket(null);
    setOpenDetailModal(false);
  };

  const handleOpenAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    setStaffList(staffData);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedTicket(null);
    setSelectedStaff("");
    setOpenAssignModal(false);
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member!"); // Show error toast
      return;
    }

    try {
      const response = await assignTicket({
        ticketId: selectedTicket.ticketId,
        userId: selectedStaff,
      }).unwrap();
      refetch();
      toast.success("Staff assigned successfully!"); // Show success toast
    } catch (err) {
      console.error("Error assigning ticket:", err);
      toast.error("Error assigning ticket!"); // Show error toast
    }

    handleCloseAssignModal();
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
            onClick={selectedTicket ? handleUpdateTicket : handleGenerateTicket}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
            ) : selectedTicket ? (
              "Update Ticket"
            ) : (
              "Generate Ticket"
            )}
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            outline: "none",
            width: "90%",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#333", fontWeight: "600", marginBottom: "20px" }}
          >
            Ticket Details
          </Typography>

          {selectedTicket && (
            <Box sx={{ color: "#555" }}>
              <Typography sx={{ marginBottom: "12px" }}>
                <strong>Priority:</strong> {selectedTicket.priority}
              </Typography>
              <Divider sx={{ marginBottom: "12px" }} />
              <Typography sx={{ marginBottom: "12px" }}>
                <strong>Status:</strong> {selectedTicket.status}
              </Typography>
              <Divider sx={{ marginBottom: "12px" }} />
              <Typography sx={{ marginBottom: "12px" }}>
                <strong>Description:</strong> {selectedTicket.description}
              </Typography>
              <Divider sx={{ marginBottom: "12px" }} />
              <Typography sx={{ marginBottom: "12px" }}>
                <strong>Category:</strong> {selectedTicket.category}
              </Typography>
              <Divider sx={{ marginBottom: "12px" }} />
              <Typography sx={{ marginBottom: "12px" }}>
                <strong>Assignee:</strong>{" "}
                {selectedTicket?.assigneeName || "Not assigned"}
              </Typography>
              <Divider sx={{ marginBottom: "12px" }} />
              <Typography sx={{ marginBottom: "18px" }}>
                <strong>Notes:</strong> {selectedTicket.resolutionNotes}
              </Typography>
              <Divider sx={{ marginBottom: "18px" }} />
            </Box>
          )}

          <Button
            onClick={handleCloseTicketDetail}
            variant="contained"
            color="primary"
            fullWidth
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={openAssignModal} onClose={handleCloseAssignModal}>
        <Box sx={{ ...modalStyle, maxWidth: "400px" }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Assign Staff to Ticket
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Staff</InputLabel>
            <Select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              label="Select Staff"
            >
              {staffList.map((staff) => (
                <MenuItem key={staff.userId} value={staff.userId}>
                  {staff.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {formErrors.staff && formErrors.staff}
            </FormHelperText>
          </FormControl>

          <Button
            onClick={handleAssignStaff}
            variant="contained"
            color="primary"
            fullWidth
          >
            Assign
          </Button>
        </Box>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
        >
          Ticket List
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography>Error loading tickets.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table aria-label="ticket table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Sr
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Notes
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Assign
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket, index) => (
                      <TableRow
                        key={ticket._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTicketDetail(ticket);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell>{ticket.description}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>{ticket.resolutionNotes}</TableCell>
                        <TableCell>
                          {(userrole === "admin" ||
                            userrole === "super-admin") && (
                            <>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(ticket);
                                }}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTicket(ticket.ticketId);
                                }}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssignModal(ticket);
                            }}
                          >
                            Assign
                          </Button>
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
