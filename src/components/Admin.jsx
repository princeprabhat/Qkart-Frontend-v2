import {
  Add,
  AdminPanelSettings,
  AttachMoney,
  Delete,
  Cancel,
  Edit,
  Group,
  Inventory,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useSnackbar } from "notistack";
import { config } from "../App";
import axios from "axios";

const Admin = () => {
  const isLoggedIn =
    localStorage.getItem("username") && localStorage.getItem("username") !== "";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");

  const { enqueueSnackbar } = useSnackbar();
  // All Data States - On Page Load
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [editUser, setEditUser] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
  });

  const [editRole, setEditRole] = useState({
    email: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    cost: "",
    rating: "",
    image: "",
    category: "",
  });
  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    cost: "",
    rating: "",
    image: "",
    category: "",
  });

  // Fetch All Products
  const fetchAllProducts = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/products`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else {
          const errMsg =
            err.message || "Something Went Wrong Fetching Products";
          enqueueSnackbar(errMsg, { variant: "error" });
        }
      });
  };
  // Fetch All Users
  const fetchAllUsers = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/users`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else {
          const errMsg =
            err.message || "Something Went Wrong Fetching Products";
          enqueueSnackbar(errMsg, { variant: "error" });
        }
      });
  };
  // Fetch All Inventory
  const fetchSalesData = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/inventory/all`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setSales(res.data.data);
        }
      })
      .catch((err) => {
        const errMsg =
          err.message || "Something went wrong fetching sales data";
        enqueueSnackbar(errMsg, { variant: "error" });
      });
  };

  // Create Normal User Request
  const createUserApi = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/users/create`;
    const data = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    };
    await axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          enqueueSnackbar("User Created Successfully", { variant: "success" });
          setUsers((prev) => [...prev, res.data.data]);
        }
      })
      .catch((err) => {
        const errMsg =
          err?.response?.data?.Error ||
          "Something went wrong, Please try again later";
        enqueueSnackbar(errMsg, { variant: "error" });
      });
  };
  // Create Admin User Request
  const createAdminApi = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/users/createAdmin`;
    const data = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    };
    await axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          enqueueSnackbar("Admin User Created Successfully", {
            variant: "success",
          });
          setUsers((prev) => [...prev, res.data.data]);
        }
      })
      .catch((err) => {
        const errMsg =
          err?.response?.data?.Error ||
          "Something went wrong, Please try again later";
        enqueueSnackbar(errMsg, { variant: "error" });
      });
  };
  // Promote Role to Admin Request
  const promoteRoleApi = async () => {
    if (!token) return;
    if (
      editRole.email === "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editRole.email)
    ) {
      enqueueSnackbar("Email is not Valid", { variant: "error" });
      return;
    }
    const url = `${config.endpoint}/admin/users/adminRole/edit`;
    const data = {
      email: editRole.email,
    };
    await axios
      .patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers(
            users.map((u) => (u._id === res.data.data._id ? res.data.data : u))
          );
          enqueueSnackbar("Role updated successfully!", { variant: "success" });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };
  // Update User Request
  const updateUserApi = async () => {
    if (!token) return;

    const url = `${config.endpoint}/admin/users/${editUser.id}`;
    const data =
      editUser.password.length > 0
        ? {
            email: editUser.email,
            name: editUser.name,
            password: editUser.password,
          }
        : {
            email: editUser.email,
            name: editUser.name,
          };
    await axios
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers(
            users.map((u) => (u._id === res.data.user._id ? res.data.user : u))
          );
          enqueueSnackbar("User updated successfully!", { variant: "success" });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };

  // Delete User Request
  const deleteUserApi = async (userId) => {
    if (!token) return;
    const url = `${config.endpoint}/admin/users/deleteUser/${userId}`;
    await axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          enqueueSnackbar(res.data.message, { variant: "success" });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };
  // Create a Product Request
  const createProductApi = async () => {
    if (!token) return;
    const url = `${config.endpoint}/admin/products/create`;
    const data = {
      name: newProduct.name,
      category: newProduct.category,
      cost: Number(newProduct.cost),
      rating: newProduct.rating,
      image: newProduct.image,
    };

    await axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setProducts((prev) => [...prev, res.data.data]);

          enqueueSnackbar("Product Created Successfully", {
            variant: "success",
          });
          setNewProduct({
            name: "",
            cost: "",
            rating: "",
            image: "",
            category: "",
            description: "",
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };
  // Update a Product Request
  const updateProductApi = async (productId) => {
    if (!token) return;
    const url = `${config.endpoint}/admin/products/updateProduct/${productId}`;
    const data = {
      name: editProduct.name,
      cost: Number(editProduct.cost),
      rating: Number(editProduct.rating),
      image: editProduct.image,
      category: editProduct.category,
    };

    await axios
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts((prev) =>
            prev.map((pr) => (pr._id === productId ? res.data.data : pr))
          );
          enqueueSnackbar("Product Updated Successfully", {
            variant: "success",
          });
          setEditProduct({
            id: "",
            name: "",
            cost: "",
            category: "",
            image: "",
            rating: "",
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };
  // Delete a Product Request
  const deleteProductApi = async (productId) => {
    if (!token) return;
    const url = `${config.endpoint}/admin/products/deleteProduct/${productId}`;
    await axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts((prev) => prev.filter((item) => item._id !== productId));
          enqueueSnackbar("Product Deleted Successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar("Something went wrong, updating user", {
            variant: "error",
          });
        }
      });
  };

  // Call APIs on Component Mount
  useEffect(() => {
    if (!token || !isAdmin || !isLoggedIn) return;
    fetchAllProducts();
    fetchAllUsers();
    fetchSalesData();
  }, []);

  // Form handlers
  const handleUserCreation = () => {
    if (newUser.role === "admin") {
      // Validate and Post a request for admin creation
      createAdminApi();
    } else {
      //Post a request for user creation
      createUserApi();
    }

    setNewUser({ name: "", email: "", password: "", role: "" });
  };

  const handleUserEditApi = () => {
    updateUserApi();
    setEditUser({ id: "", email: "", name: "", password: "" });
  };

  const handleProductCreation = () => {
    createProductApi();
  };

  const handleUserChange = (field) => (e) => {
    setNewUser({ ...newUser, [field]: e.target.value });
  };

  const handleUserEdit = (field) => (e) => {
    setEditUser({ ...editUser, [field]: e.target.value });
  };

  const handleNewProductChange = (field) => (e) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  const handleProductChange = (field) => (e) => {
    setEditProduct({ ...editProduct, [field]: e.target.value });
  };

  // TODO: Make this function to send delete request and save the retured data in setUsers
  const handleDeleteUser = (userId) => {
    if (!userId) {
      enqueueSnackbar("User Id missing to delete the data", {
        variant: "error",
      });
      return;
    }
    if (userId === localStorage.getItem("userId")) {
      enqueueSnackbar("Current Logged-in user cannot be deleted", {
        variant: "error",
      });
      return;
    }
    deleteUserApi(userId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  const validateNewUserForm = () => {
    if (newUser.name === "") {
      enqueueSnackbar("Name is required", { variant: "warning" });
      return false;
    }
    if (newUser.email === "") {
      enqueueSnackbar("Email is required", { variant: "warning" });
      return false;
    }
    if (newUser.password === "") {
      enqueueSnackbar("Password is required", { variant: "warning" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      enqueueSnackbar("Email is not valid", { variant: "warning" });
      return false;
    }
    if (newUser.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    if (newUser.role === "") {
      enqueueSnackbar("Role is required", { variant: "warning" });
      return false;
    }
    return true;
  };

  const validateEditUserForm = () => {
    if (editUser.id === "") {
      enqueueSnackbar("Please select a user to edit", { variant: "warning" });
      return false;
    }
    if (editUser.email == "") {
      enqueueSnackbar("Email is required", { variant: "warning" });
      return false;
    }
    if (editUser.name === "") {
      enqueueSnackbar("Name is required", { variant: "warning" });
      return false;
    }
    if (editUser.password && editUser.password.length < 6) {
      enqueueSnackbar("New Password length is less than 6", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const validateProductCreate = () => {
    if (!newProduct.name) {
      enqueueSnackbar("Product Name is required", { variant: "warning" });
      return false;
    }
    if (!newProduct.category) {
      enqueueSnackbar("Product category is required", { variant: "warning" });
      return false;
    }
    if (!newProduct.cost || Number(newProduct.cost) <= 0) {
      enqueueSnackbar("Product cost is required and greater than 1$", {
        variant: "warning",
      });
      return false;
    }
    if (!newProduct.image) {
      enqueueSnackbar("Product Image link is required", { variant: "warning" });
      return false;
    }
    if (!newProduct.rating) {
      enqueueSnackbar("Product Rating is required", { variant: "warning" });
      return false;
    }
    return true;
  };

  const validateEditProducts = () => {
    if (!editProduct.id) {
      enqueueSnackbar("Please select a product to edit", {
        variant: "warning",
      });
      return false;
    }
    if (!editProduct.name) {
      enqueueSnackbar("Product name is required to edit", {
        variant: "warning",
      });
      return false;
    }
    if (!editProduct.cost) {
      enqueueSnackbar("Product cost is required to edit", {
        variant: "warning",
      });
      return false;
    }
    if (!editProduct.rating) {
      enqueueSnackbar("Product rating is required to edit", {
        variant: "warning",
      });
      return false;
    }
    if (!editProduct.image) {
      enqueueSnackbar("Product image is required to edit", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div>
        <Header IsLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" color="error" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1">
              You need admin privileges to access this page.
            </Typography>
          </Paper>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <style>
        {`
          .action-buttons {
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          .MuiTableRow-root:hover .action-buttons {
            opacity: 1 !important;
          }
        `}
      </style>
      <Header
        IsLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        hasHiddenAuthButtons={true}
      />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Admin Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            <AdminPanelSettings sx={{ mr: 2, verticalAlign: "middle" }} />
            Qkart Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage users, products, and sales data
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Group color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{users.length}</Typography>
                    <Typography color="text.secondary">Total Users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Inventory color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{products.length}</Typography>
                    <Typography color="text.secondary">
                      Total Products
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ShoppingCart color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{sales.length}</Typography>
                    <Typography color="text.secondary">Total Orders</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoney color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      $
                      {sales
                        .reduce((sum, sale) => sum + sale.amount, 0)
                        .toFixed(2)}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Users Creation */}
          <Grid item xs={12} md={6}>
            <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
              <Stack spacing={2}>
                <Typography variant="h5"> Create User</Typography>
                <TextField
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Name"
                  name="name"
                  id="name"
                  value={newUser.name}
                  onChange={handleUserChange("name")}
                  required
                  title="Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  placeholder="Enter Email"
                  name="email"
                  id="email"
                  value={newUser.email}
                  onChange={handleUserChange("email")}
                  required
                  title="Email"
                  type="email"
                  fullWidth
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  id="password"
                  value={newUser.password}
                  onChange={handleUserChange("password")}
                  required
                  title="Password"
                  fullWidth
                />
                <TextField
                  select
                  SelectProps={{ native: true }}
                  value={newUser.role}
                  onChange={handleUserChange("role")}
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </TextField>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={() =>
                      setNewUser({
                        name: "",
                        email: "",
                        password: "",
                        role: "",
                      })
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (validateNewUserForm()) {
                        handleUserCreation();
                      }
                    }}
                  >
                    <Add />
                    Create User
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* User Edit */}
          <Grid item xs={12} md={6}>
            <Box p={2} border={1} borderColor="grey.300" borderRadius={2}>
              <Stack spacing={2}>
                <Typography variant="h5">Update User</Typography>
                <TextField
                  label="Email"
                  variant="outlined"
                  placeholder="Enter Email"
                  name="email"
                  id="emailEdit"
                  value={editUser.email}
                  onChange={handleUserEdit("email")}
                  title="Email"
                  type="email"
                  fullWidth
                />

                <TextField
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Name"
                  name="name"
                  id="nameEdit"
                  value={editUser.name}
                  onChange={handleUserEdit("name")}
                  title="Name"
                  type="text"
                  fullWidth
                />

                <TextField
                  label="New Password"
                  variant="outlined"
                  type="text"
                  placeholder="Enter New Password, leave it if no updation required"
                  name="password"
                  id="passwordEdit"
                  value={editUser.password}
                  onChange={handleUserEdit("password")}
                  title="Password"
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={() =>
                      setEditUser({ id: "", name: "", email: "", password: "" })
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (validateEditUserForm()) {
                        // TODO handle user updatation
                        handleUserEditApi();
                      }
                    }}
                  >
                    <Edit /> Update User
                  </Button>
                </Stack>
                <Divider />
                <Typography variant="h6">Promote Role To Admin</Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    placeholder="Enter Normal User Email"
                    name="email"
                    id="emailPromote"
                    value={editRole.email}
                    onChange={(e) => setEditRole({ email: e.target.value })}
                    title="Email"
                    type="email"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setEditRole({ email: "" })}
                          >
                            {editRole.email.length !== 0 && <Cancel />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* TODO:Handle PromoteRole Api Request */}
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => promoteRoleApi()}
                  >
                    <Edit />
                    Promote
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          {/* User List Section */}
          <Grid item xs={12} sm={12} mb={6}>
            <Card>
              <CardHeader title="Users List" />
              <CardContent>
                <TableContainer sx={{ maxHeight: 300, overflowY: "auto" }}>
                  <Table stickyHeader size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user._id}
                          sx={{
                            "&:hover .action-buttons": {
                              opacity: 1,
                            },
                          }}
                        >
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.isAdmin ? "Admin" : "User"}
                              color={user.isAdmin ? "primary" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() =>
                                setEditUser({
                                  id: user._id,
                                  email: user.email,
                                  name: user.name,
                                  password: "",
                                })
                              }
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Create Product Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Create New Product" />
              <CardContent>
                {/* TODO: Handle Creation On click */}
                <Box component="form">
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={newProduct.name}
                    onChange={handleNewProductChange("name")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={newProduct.cost}
                    onChange={handleNewProductChange("cost")}
                    margin="normal"
                    required
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                  <TextField
                    fullWidth
                    label="Rating"
                    type="number"
                    value={newProduct.rating}
                    onChange={handleNewProductChange("rating")}
                    margin="normal"
                    required
                    inputProps={{ step: "0.1", min: "0", max: "5" }}
                  />
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={newProduct.image}
                    onChange={handleNewProductChange("image")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Category"
                    value={newProduct.category}
                    onChange={handleNewProductChange("category")}
                    margin="normal"
                    required
                  />
                  {/* TODO:Handle Submit request to create */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (validateProductCreate()) {
                        handleProductCreation();
                      }
                    }}
                  >
                    <Add />
                    Create Product
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Update Product Section */}

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Edit Existing Product" />
              <CardContent>
                <Box component="form">
                  <TextField
                    fullWidth
                    label="Product Id"
                    value={editProduct.id}
                    onChange={handleProductChange("id")}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={editProduct.name}
                    onChange={handleProductChange("name")}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={editProduct.cost}
                    onChange={handleProductChange("cost")}
                    margin="normal"
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                  <TextField
                    fullWidth
                    label="Rating"
                    type="number"
                    value={editProduct.rating}
                    onChange={handleProductChange("rating")}
                    margin="normal"
                    inputProps={{ step: "0.1", min: "0", max: "5" }}
                  />
                  <Stack direction="row" gap={1} alignItems="center">
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={editProduct.image}
                      onChange={handleProductChange("image")}
                      margin="normal"
                    />
                    <Box className="image-container">
                      <img
                        // Add product image
                        src={editProduct.image}
                        // Add product name as alt eext
                        alt={editProduct.name}
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  </Stack>

                  <TextField
                    fullWidth
                    label="Category"
                    value={editProduct.category}
                    onChange={handleProductChange("category")}
                    margin="normal"
                  />
                  {/* TODO:Handle submit request to edit product */}
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (validateEditProducts()) {
                        updateProductApi(editProduct.id);
                      }
                    }}
                  >
                    <Edit />
                    Edit Product
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Products Section */}
          <Grid item xs={12} mb={6}>
            <Card>
              <CardHeader title="Products List" />
              <CardContent>
                <TableContainer sx={{ maxHeight: 300, overflowY: "auto" }}>
                  <Table stickyHeader size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow
                          key={product._id}
                          sx={{
                            "&:hover .action-buttons": {
                              opacity: 1,
                            },
                          }}
                        >
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{`$${product.cost}`}</TableCell>
                          <TableCell>{product.rating}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteProductApi(product._id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            {/* TODO: Add Onclick to fill the edit form */}
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() =>
                                setEditProduct({
                                  id: product._id,
                                  name: product.name,
                                  cost: product.cost,
                                  rating: product.rating,
                                  image: product.image,
                                  category: product.category,
                                })
                              }
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales Section */}
          <Grid item xs={12} mb={6}>
            <Card>
              <CardHeader title="Sales & Orders" />
              <CardContent>
                <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Table stickyHeader size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sales.length > 0 &&
                        sales.map((sale) => (
                          <TableRow key={sale._id}>
                            <TableCell>
                              {"OID" + sale._id.slice(0, 7)}
                            </TableCell>
                            <TableCell>{sale.name}</TableCell>
                            <TableCell>{sale.email}</TableCell>
                            <TableCell>
                              {sale.products.map((item, index) => (
                                <Typography key={index} variant="body2">
                                  {item.productName} (x{item.quantity})
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell>${sale.amount}</TableCell>
                            <TableCell>
                              <Chip
                                label={sale.status}
                                color={getStatusColor(sale.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(sale.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Admin;
