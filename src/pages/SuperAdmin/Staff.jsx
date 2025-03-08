import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../store/apiSlices/usersApiSlice";
import { setPage } from "../../store/stateSlices/usersStateSlice";
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
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const Staff = () => {
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state) => state.users);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, isLoading, refetch } = useGetUsersQuery("staff");
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  // Open Modal for Add/Edit
  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setUserId(user.userId);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setIsEditing(false);
      setUserId(null);
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
    }
    setOpenModal(true);
  };

  // Validate fields
  const validateFields = () => {
    if (!name) {
      toast.error("Name is required!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }
    if (!password && !isEditing) {
      toast.error("Password is required!");
      return false;
    }
    if (password && password.length < 6) {
      toast.error("Password should be at least 6 characters long!");
      return false;
    }
    return true;
  };

  const handleSaveUser = async () => {
    if (!validateFields()) return; // Validate before saving

    setLoading(true);
    try {
      if (isEditing) {
        // Ensure the userId is passed correctly when updating
        await updateUser({ userId, name, email, role }).unwrap();
        toast.success("User updated successfully!"); // Show success toast for update
      } else {
        await createUser({ name, email, password, role }).unwrap();
        toast.success("User added successfully!"); // Show success toast for adding
      }
      setOpenModal(false);
      refetch();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Error saving user.");
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  // Delete User
  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.userId).unwrap();
      setDeleteDialog(false);
      refetch();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user.");
    }
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

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          Staff List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add Staff Member
        </Button>
      </Box>

      {/* Responsive Table */}
      <TableContainer
        component={Paper}
        sx={{ mt: 2, overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Sr
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.users?.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{ backgroundColor: index % 2 ? "#f9f9f9" : "white" }}
              >
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "12px",
                      backgroundColor:
                        user.role === "admin" ? "#ff9800" : "#4caf50",
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenModal(user)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(user)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.totalCount || 0}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={handleChangePage}
      />

      {/* Add/Edit User Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: 300, sm: 400 },
          }}
        >
          <Typography variant="h6">
            {isEditing ? "Edit Staff Member" : "Add Staff Member"}
          </Typography>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          {!isEditing && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveUser}
            sx={{ mt: 2 }}
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Staff;
