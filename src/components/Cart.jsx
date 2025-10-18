import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect, useState } from "react";
import { config } from "../App";
import axios from "axios";

export const generateCartItemsFrom = (cartData, productsData) => {
  const cartRes = cartData.map((item) => {
    const matchData = productsData.find(
      (product) => item.productId === product._id
    );
    return { ...item, ...matchData };
  });
  return cartRes;
};

export const getTotalCartValue = (items = []) => {
  const cost = items.reduce(
    (acc, val) => acc + val.product.cost * val.quantity,
    0
  );

  return cost;
};

export const getTotalItems = (items = []) => {
  const totalItem = items.reduce((acc, item) => item.quantity + acc, 0);
  return totalItem;
};

const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly && (
        <IconButton
          disabled={value === 0}
          size="small"
          color="primary"
          onClick={handleDelete}
        >
          <RemoveOutlined />
        </IconButton>
      )}

      {isReadOnly && <div>Qty:</div>}
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      {!isReadOnly && (
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      )}
    </Stack>
  );
};

const Cart = ({
  products = [],
  // cartItems = [],
  handleQuantity,
  isReadOnly,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);

  const updateCartQuantity = async (token, productId, qty) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });

      return;
    }

    const url = config.endpoint + "/cart";

    const data = {
      productId: productId,
      quantity: qty,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    await axios
      .put(url, data, { headers })
      .then((response) => {
        setCartItems(response.data.cartItems);
      })
      .catch((err) => {
        if (err.response) {
          enqueueSnackbar(err?.response?.data?.Error, { variant: "error" });
        } else {
          enqueueSnackbar(`${err.message} Please try again later`, {
            variant: "error",
          });
        }
      });
  };

  useEffect(() => {
    if (!token || !isLoggedIn) {
      enqueueSnackbar("Login to view the cart page", { variant: "warning" });
      navigate("/");
      return;
    }

    const fetchCart = async (token) => {
      if (!token) return;

      const url = `${config.endpoint}/cart`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCartItems(res?.data?.cart?.cartItems);
        })
        .catch((err) => {
          const errMsg = err?.message || "Internal Server Error";
          enqueueSnackbar(errMsg, { variant: "error" });
        });
    };

    fetchCart(token);
  }, []);

  if (!cartItems.length) {
    return (
      <>
        <Header />
        <Box className="cart empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.
          </Box>
        </Box>
        <Footer />
      </>
    );
  }

  const resultCart = isReadOnly
    ? cartItems
    : generateCartItemsFrom(cartItems, products);

  return (
    <>
      <Header />
      <Box className="cart">
        {resultCart.map((item) => {
          return (
            <Box
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              key={item?.product._id}
            >
              <Box className="image-container">
                <img
                  // Add product image
                  src={item.product.image}
                  // Add product name as alt eext
                  alt={item.product.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{item.product.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <ItemQuantity
                    // Add required props by checking implementation
                    value={item.quantity}
                    handleAdd={async () =>
                      await updateCartQuantity(
                        token,
                        item.product._id,
                        item.quantity + 1
                      )
                    }
                    handleDelete={async () =>
                      await updateCartQuantity(
                        token,
                        item.product._id,
                        item.quantity - 1
                      )
                    }
                    isReadOnly={isReadOnly}
                  />
                  <Box padding="0.5rem" fontWeight="700">
                    ${item.product.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItems)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          sx={{
            margin: "0.5rem",
            background: "#ffffff",
            padding: "15px",
            py: "2rem",
          }}
        >
          <Stack
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            marginBottom="1rem"
          >
            <div>Order Details</div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <div>Products</div>
            <div>{getTotalItems(cartItems)}</div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <div>Subtotal</div>
            <div>${getTotalCartValue(cartItems)}</div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
          >
            <div>Shipping Charges</div>
            <div>$0</div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.2rem"
          >
            <div>Total</div>
            <div>${getTotalCartValue(cartItems)}</div>
          </Stack>
        </Box>
      )}
      <Footer />
    </>
  );
};

export default Cart;
