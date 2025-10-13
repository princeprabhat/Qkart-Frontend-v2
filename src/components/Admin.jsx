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
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

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
  // TODO: Fetch All Users
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

  // Dummy data for demonstration

  const [sales] = useState([
    {
      _id: "1",
      orderId: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      totalAmount: 299.98,
      orderDate: "2024-01-15",
      status: "Delivered",
      items: [
        { productName: "Wireless Headphones", quantity: 1, price: 99.99 },
        { productName: "Smart Watch", quantity: 1, price: 199.99 },
      ],
    },
    {
      _id: "2",
      orderId: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@example.com",
      totalAmount: 79.99,
      orderDate: "2024-01-20",
      status: "Processing",
      items: [{ productName: "Coffee Maker", quantity: 1, price: 79.99 }],
    },
    {
      _id: "3",
      orderId: "ORD-003",
      customerName: "Bob Johnson",
      customerEmail: "bob.johnson@example.com",
      totalAmount: 199.99,
      orderDate: "2024-02-01",
      status: "Shipped",
      items: [{ productName: "Smart Watch", quantity: 1, price: 199.99 }],
    },
  ]);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [editUser, setEditUser] = useState({
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
  // Call APIs on Component Mount
  useEffect(() => {
    if (!token || !isAdmin || !isLoggedIn) return;
    fetchAllProducts();
    fetchAllUsers();
  }, []);

  // Form handlers
  const handleUserCreation = () => {
    if (newUser.role === "admin") {
      // Post a request for admin creation
    } else {
      // Post a request for user creation
    }

    console.log("Creating user:", newUser);
    // TODO: Implement API call to create user
    setNewUser({ name: "", email: "", password: "" });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    console.log("Creating product:", newProduct);
    // TODO: Implement API call to create product
    setNewProduct({
      name: "",
      cost: "",
      rating: "",
      image: "",
      category: "",
      description: "",
    });
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

  // Edit handlers
  const handleEditUser = (user) => {};

  // TODO: Make this function to send delete request and save the retured data in setUsers
  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user._id !== userId));
    console.log("Deleted user:", userId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "warning";
      case "Shipped":
        return "info";
      default:
        return "default";
    }
  };

  const validateForm = () => {
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
                        .reduce((sum, sale) => sum + sale.totalAmount, 0)
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
                      if (validateForm()) {
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
                <Typography variant="h5">Update User By Email</Typography>
                <TextField
                  label="Email"
                  variant="outlined"
                  placeholder="Enter Email"
                  name="email"
                  id="emailEdit"
                  disabled
                  value={editUser.email}
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
                      setEditUser({ name: "", email: "", password: "" })
                    }
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      if (validateForm()) {
                        // TODO handle user updatation
                        // handleUserCreation();
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
                  <Button variant="contained" color="warning">
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
                                  email: user.email,
                                  name: user.name,
                                  password: user.password,
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
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>
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
                            <IconButton size="small" color="error">
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
                      {sales.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell>{sale.orderId}</TableCell>
                          <TableCell>{sale.customerName}</TableCell>
                          <TableCell>{sale.customerEmail}</TableCell>
                          <TableCell>
                            {sale.items.map((item, index) => (
                              <Typography key={index} variant="body2">
                                {item.productName} (x{item.quantity})
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell>${sale.totalAmount}</TableCell>
                          <TableCell>
                            <Chip
                              label={sale.status}
                              color={getStatusColor(sale.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{sale.orderDate}</TableCell>
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
