import {
  Add,
  AdminPanelSettings,
  AttachMoney,
  Delete,
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

import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useSnackbar } from "notistack";

const Admin = () => {
  const isLoggedIn =
    localStorage.getItem("username") && localStorage.getItem("username") !== "";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const enqueueSnackbar = useSnackbar();

  // Dummy data for demonstration
  const [users, setUsers] = useState([
    {
      _id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-15",
      isAdmin: false,
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      createdAt: "2024-01-20",
      isAdmin: true,
    },
    {
      _id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      createdAt: "2024-02-01",
      isAdmin: false,
    },
    {
      _id: "4",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      createdAt: "2024-02-01",
      isAdmin: false,
    },
    {
      _id: "7",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      createdAt: "2024-02-01",
      isAdmin: false,
    },
    {
      _id: "5",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      createdAt: "2024-02-01",
      isAdmin: false,
    },
    {
      _id: "6",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      createdAt: "2024-02-01",
      isAdmin: false,
    },
  ]);

  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "Wireless Headphones",
      cost: 99.99,
      rating: 4.5,
      image: "https://via.placeholder.com/300x300",
      category: "Electronics",
      description: "High-quality wireless headphones",
    },
    {
      _id: "2",
      name: "Smart Watch",
      cost: 199.99,
      rating: 4.2,
      image: "https://via.placeholder.com/300x300",
      category: "Electronics",
      description: "Feature-rich smart watch",
    },
    {
      _id: "3",
      name: "Coffee Maker",
      cost: 79.99,
      rating: 4.7,
      image: "https://via.placeholder.com/300x300",
      category: "Appliances",
      description: "Automatic coffee maker",
    },
  ]);

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

  const [newProduct, setNewProduct] = useState({
    name: "",
    cost: "",
    rating: "",
    image: "",
    category: "",
    description: "",
  });

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editUserData, setEditUserData] = useState({});
  const [editProductData, setEditProductData] = useState({});

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

  const handleProductChange = (field) => (e) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  // Edit handlers
  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditUserData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditProductData({
      name: product.name,
      cost: product.cost,
      rating: product.rating,
      image: product.image,
      category: product.category,
      description: product.description,
    });
  };

  const handleUpdateUser = () => {
    setUsers(
      users.map((user) =>
        user._id === editingUser ? { ...user, ...editUserData } : user
      )
    );
    setEditingUser(null);
    setEditUserData({});
    console.log("Updated user:", editUserData);
  };

  const handleUpdateProduct = () => {
    setProducts(
      products.map((product) =>
        product._id === editingProduct
          ? { ...product, ...editProductData }
          : product
      )
    );
    setEditingProduct(null);
    setEditProductData({});
    console.log("Updated product:", editProductData);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditingProduct(null);
    setEditUserData({});
    setEditProductData({});
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user._id !== userId));
    console.log("Deleted user:", userId);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product._id !== productId));
    console.log("Deleted product:", productId);
  };

  const handleEditUserDataChange = (field) => (e) => {
    setEditUserData({ ...editUserData, [field]: e.target.value });
  };

  const handleEditProductDataChange = (field) => (e) => {
    setEditProductData({ ...editProductData, [field]: e.target.value });
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
                      setNewUser({ name: "", email: "", password: "" })
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
                {
                  // TODO Email Should be a dropdown where we can select user email to update. Email cannot be updated
                }
                <TextField
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Name"
                  name="name"
                  id="name"
                  value={newUser.name}
                  onChange={handleUserChange("name")}
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
                  title="Password"
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={() =>
                      setNewUser({ name: "", email: "", password: "" })
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
                  {
                    //TODO Update user role based on email.
                  }
                  <TextField
                    label="Email"
                    variant="outlined"
                    placeholder="Enter Normal User Email"
                    name="email"
                    id="email"
                    // value={newUser.email}
                    // onChange={handleUserChange("email")}
                    title="Email"
                    type="email"
                    fullWidth
                  />
                  <Button variant="contained" color="warning">
                    <Edit />
                    Promote
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12}>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Products Section */}
          {/* <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Products"
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      // TODO: Open product creation form modal
                    }}
                  >
                    Add Product
                  </Button>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow 
                          key={product._id}
                          sx={{
                            '&:hover .action-buttons': {
                              opacity: 1,
                            },
                          }}
                        >
                          <TableCell>
                            {editingProduct === product._id ? (
                              <TextField
                                size="small"
                                value={editProductData.name}
                                onChange={handleEditProductDataChange("name")}
                                fullWidth
                              />
                            ) : (
                              product.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product._id ? (
                              <TextField
                                size="small"
                                value={editProductData.category}
                                onChange={handleEditProductDataChange("category")}
                                fullWidth
                              />
                            ) : (
                              product.category
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product._id ? (
                              <TextField
                                size="small"
                                type="number"
                                value={editProductData.cost}
                                onChange={handleEditProductDataChange("cost")}
                                inputProps={{ step: "0.01", min: "0" }}
                                fullWidth
                              />
                            ) : (
                              `$${product.cost}`
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product._id ? (
                              <TextField
                                size="small"
                                type="number"
                                value={editProductData.rating}
                                onChange={handleEditProductDataChange("rating")}
                                inputProps={{ step: "0.1", min: "0", max: "5" }}
                                fullWidth
                              />
                            ) : (
                              product.rating
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box 
                              className="action-buttons"
                              sx={{ 
                                opacity: editingProduct === product._id ? 1 : 0,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'center'
                              }}
                            >
                              {editingProduct === product._id ? (
                                <>
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={handleUpdateProduct}
                                  >
                                    <Typography variant="caption">OK</Typography>
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={handleCancelEdit}
                                  >
                                    <Typography variant="caption">Cancel</Typography>
                                  </IconButton>
                                </>
                              ) : (
                                <>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteProduct(product._id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid> */}

          {/* Sales Section */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Sales & Orders" />
              <CardContent>
                <TableContainer>
                  <Table>
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

          {/* Create User Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Create New User" />
              <CardContent>
                <Box component="form">
                  <TextField
                    fullWidth
                    label="Name"
                    value={newUser.name}
                    onChange={handleUserChange("name")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={newUser.email}
                    onChange={handleUserChange("email")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={handleUserChange("password")}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Create User
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Create Product Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Create New Product" />
              <CardContent>
                <Box component="form" onSubmit={handleProductSubmit}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={newProduct.name}
                    onChange={handleProductChange("name")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Cost"
                    type="number"
                    value={newProduct.cost}
                    onChange={handleProductChange("cost")}
                    margin="normal"
                    required
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                  <TextField
                    fullWidth
                    label="Rating"
                    type="number"
                    value={newProduct.rating}
                    onChange={handleProductChange("rating")}
                    margin="normal"
                    required
                    inputProps={{ step: "0.1", min: "0", max: "5" }}
                  />
                  <TextField
                    fullWidth
                    label="Image URL"
                    value={newProduct.image}
                    onChange={handleProductChange("image")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Category"
                    value={newProduct.category}
                    onChange={handleProductChange("category")}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newProduct.description}
                    onChange={handleProductChange("description")}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Create Product
                  </Button>
                </Box>
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
