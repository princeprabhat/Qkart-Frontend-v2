import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) => {
          handleNewAddress((currNewAddress) => ({
            ...currNewAddress,
            value: e.target.value,
          }));
        }}
      />
      <Stack direction="row" my="1rem">
        <Button
          variant="contained"
          onClick={() => {
            addAddress(token, newAddress.value);
          }}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() => {
            handleNewAddress(() => ({
              value: "",
              isAddingNewAddress: false,
            }));
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  // Get All cart Items by token provided, req-Token, res - cartItems:[{}]

  const getCartItems = async () => {
    if (!token) {
      return;
    }
    const url = `${config.endpoint}/cart`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setCartItems(res.data.cart.cartItems);
        }
        if (res.data.cart.cartItems.length == 0) {
          enqueueSnackbar(
            "You must have items in cart to access checkout page",
            {
              variant: "warning",
            }
          );

          navigate("/");
        }
      })
      .catch((err) => {
        const errMsg =
          err.message + " Please try again later" ||
          "Something Went Wrong Fetching Cart Details";
        enqueueSnackbar(errMsg, { variant: "error" });
      });
  };

  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  // Get all addresses user have, saved in the db
  const getUserAddress = async () => {
    if (!token) return;
    const userId = localStorage.getItem("userId");
    const url = `${config.endpoint}/users/address/${userId}`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAddresses((prev) => ({ ...prev, all: res.data.addresses }));
        }
      })
      .catch((err) => {
        const errMsg =
          err.message || "Something went wrong... Please login again";
        enqueueSnackbar(errMsg, { variant: "error" });
      });
  };

  const addAddress = async (token, newAddress) => {
    if (!token) return;
    const userId = localStorage.getItem("userId");
    const url = `${config.endpoint}/users/address/${userId}`;

    await axios
      .post(
        url,
        { address: newAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setAddresses((prev) => ({
            ...prev,
            all: res.data.addresses,
            selected: res.data.addresses[res.data.addresses.length - 1]._id,
          }));
          setNewAddress({ isAddingNewAddress: false, value: "" });
        }
      })
      .catch((err) => {
        if (err.status == 409) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else if (err.status == 400) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else {
          enqueueSnackbar(err.message + " Please try again later", {
            variant: "error",
          });
        }
      });
  };

  const deleteAddress = async (addressId) => {
    if (!token) return;
    const userId = localStorage.getItem("userId");
    const url = `${config.endpoint}/users/address/${userId}`;

    await axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { addressId },
      })
      .then((res) => {
        if (res.status == 200) {
          setAddresses((prev) => ({ ...prev, all: res.data.addresses }));
        }
      })
      .catch((err) => {
        if (err.status == 401) {
          enqueueSnackbar("Please authenticate, sign-in again", {
            variant: "error",
          });
        } else {
          const errMsg =
            err.message || "Some error occured, Please try after some time";
          enqueueSnackbar(errMsg, { variant: "error" });
        }
      });
  };

  // const validateRequest = (items, addresses) => {
  //   const totalPrice = getTotalCartValue(items);
  //   const walletBalance = localStorage.getItem("balance");

  //   if (walletBalance < totalPrice) {
  //     enqueueSnackbar(
  //       "You do not have enough balance in your wallet for this purchase",
  //       {
  //         variant: "warning",
  //       }
  //     );
  //     return false;
  //   }

  //   if (addresses.all.length === 0) {
  //     enqueueSnackbar("Please add a new address before proceeding.", {
  //       variant: "warning",
  //     });
  //     return false;
  //   }

  //   if (addresses.selected.length === 0) {
  //     enqueueSnackbar("Please select one shipping address to proceed.", {
  //       variant: "warning",
  //     });
  //     return false;
  //   }

  //   return true;
  // };

  const performCheckout = async (token, addresses) => {
    if (!token) return;

    if (addresses.all.length == 0) {
      enqueueSnackbar("Please add an adress before checkout", {
        variant: "warning",
      });
      return;
    }
    if (addresses.selected.length == 0) {
      enqueueSnackbar("Please select an address to checkout", {
        variant: "warning",
      });
      return;
    }
    const url = `${config.endpoint}/cart/checkout`;
    await axios
      .put(
        url,
        { addressId: addresses.selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        enqueueSnackbar("Order placed successfully", {
          variant: "success",
        });
        localStorage.setItem("balance", res.data.cart.remainingWallet);
        navigate("/thanks");
      })
      .catch((err) => {
        if (err.status == 400 || err.status == 404) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else {
          const errMsg =
            err.message || "Something went wrong. Please try again later";
          enqueueSnackbar(errMsg, { variant: "error" });
        }
      });

    // try {
    //   await axios.post(
    //     `${config.endpoint}/cart/checkout`,
    //     {
    //       addressId: addresses.selected,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   return true;
    // } catch (e) {
    //   if (e.response) {
    //     enqueueSnackbar(e.response.data.message, { variant: "error" });
    //   } else {
    //     enqueueSnackbar(
    //       "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
    //       {
    //         variant: "error",
    //       }
    //     );
    //   }
    //   return false;
    // }
  };

  const isLoggedIn =
    localStorage.getItem("username") && localStorage.getItem("username") !== "";

  const updateSelectedAddress = (selectedAddress) => {
    setAddresses((prevState) => ({
      ...prevState,
      selected: selectedAddress,
    }));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      enqueueSnackbar("You must be logged in to access checkout page", {
        variant: "info",
      });

      navigate("/");
    } else {
      getUserAddress();
      getCartItems();
    }
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Header hasHiddenAuthButtons IsLoggedIn />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/*Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}
              <Box>
                {addresses.all.map((item) => {
                  return (
                    <Box
                      className={`address-item ${
                        addresses.selected === item._id
                          ? "selected"
                          : "not-selected"
                      }`}
                      key={item._id}
                      onClick={() => {
                        updateSelectedAddress(item._id);
                      }}
                    >
                      {item.address}
                      <Button
                        startIcon={<Delete />}
                        variant="text"
                        onClick={() => {
                          deleteAddress(item._id);
                        }}
                      >
                        DELETE
                      </Button>
                    </Box>
                  );
                })}
              </Box>
              {!addresses?.all && (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
                </Typography>
              )}
            </Box>

            {/* Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            {!newAddress.isAddingNewAddress ? (
              <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  setNewAddress((currNewAddress) => ({
                    ...currNewAddress,
                    isAddingNewAddress: true,
                  }));
                }}
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            )}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(cartItems)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => {
                performCheckout(token, addresses);
                // if (
                //   // validateRequest(cartItems, addresses)
                // ) {
                //   enqueueSnackbar("Order placed successfully", {
                //     variant: "success",
                //   });
                //   localStorage.setItem(
                //     "balance",
                //     localStorage.getItem("balance") -
                //       getTotalCartValue(cartItems)
                //   );
                //   navigate("/thanks");
                // }
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly cartItems={cartItems} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
