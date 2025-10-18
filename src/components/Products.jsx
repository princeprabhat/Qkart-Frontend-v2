import {
  ChevronLeft,
  ChevronRight,
  Search,
  SentimentDissatisfied,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { border, Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
// import { generateCartItemsFrom } from "./Cart";
// import { productData } from "../data";

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const isLoggedIn =
    localStorage.getItem("username") && localStorage.getItem("username") !== "";

  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(false);

  const [productCount, setProductCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const numberOfPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const start = ITEMS_PER_PAGE * activeIndex;
  const end = start + ITEMS_PER_PAGE;

  const handlePageChange = (action) => {
    if (action == "NextPage" && activeIndex + 1 < numberOfPages) {
      setActiveIndex((prev) => prev + 1);
    }
    if (action == "PrevPage" && activeIndex + 1 > 1) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const performAPICall = async () => {
    setLoader(true);
    const url = config.endpoint + "/products";
    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data.products);
          setFilteredItems(res.data.products);
          setLoader(false);
        }
      })
      .catch((err) => {
        const msg = err?.message || "Some Error Occured";
        enqueueSnackbar(msg, { variant: "error" });
      });
  };

  const fetchCartCount = async (token) => {
    if (!token) return;

    const url = `${config.endpoint}/cart/cartCount`;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) setProductCount(res?.data?.count);
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

  // Calling Api to fetch Products and if user is logged in fetch the cartItems
  const token = localStorage.getItem("token");
  useEffect(() => {
    performAPICall();

    const alreadyShown = sessionStorage.getItem("serverWakeupMessageShown");

    if (!alreadyShown && (!isLoggedIn || !token)) {
      enqueueSnackbar(
        "Our servers may take 20 seconds to load, on first visit. Thank you for your patience — your experience will load shortly.",
        {
          variant: "info",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 8000,
          sx: {
            fontSize: "1.8rem",
            fontWeight: "700",
            maxWidth: "600px",
            textAlign: "center",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(104, 255, 116, 0.32)",
          },
        }
      );
      sessionStorage.setItem("serverWakeupMessageShown", "true");
    }

    if (isLoggedIn) {
      fetchCartCount(localStorage.getItem("token"));
    }
  }, []);

  const performSearch = (text) => {
    const filteredData = items.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filteredData);
    setActiveIndex(0);
  };

  const debounce = (func) => {
    let timeoutId;
    return function executedFunction(value, delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(value);
      }, delay);
    };
  };

  const debouncePerformance = debounce(performSearch);

  const debounceSearch = (event, debounceTimeout) => {
    debouncePerformance(event.target.value, debounceTimeout);
  };

  // Check Item is already in the cart or not

  // const isItemInCart = (items, productId) => {
  //   const res = items.some((item) => item.product._id === productId);
  //   return res;
  // };

  // Add a new Item in the cart

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
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
      .post(url, data, { headers })
      .then((response) => {
        if (response.status === 201) {
          enqueueSnackbar("Product is added in the cart", {
            variant: "success",
          });
          setProductCount(response?.data?.cartItems?.length);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
        } else {
          enqueueSnackbar(`${err.message} Please try again later`, {
            variant: "error",
          });
        }
      });
  };

  return (
    <div>
      <Header
        hasHiddenAuthButtons={true}
        IsLoggedIn={isLoggedIn}
        isAdmin={localStorage.getItem("isAdmin") === "true" ? true : false}
        hasCartIcon
        productCount={productCount}
      >
        <TextField
          sx={{ width: "350px" }}
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, 500);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, 500);
        }}
      />

      <Grid
        container
        // sx={{ width: { md: `${isLoggedIn ? "75%" : "100%"}` } }}
      >
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {loader ? (
          <Box className="loading">
            <CircularProgress />

            <h4>Loading Products</h4>
          </Box>
        ) : (
          <Grid container spacing={2} p={2}>
            {filteredItems.length > 0 &&
              filteredItems.slice(start, end).map((item) => {
                return (
                  <Grid item xs={6} md={4} lg={3} key={item["_id"]}>
                    <ProductCard product={item} handleAddToCart={addToCart} />
                  </Grid>
                );
              })}
          </Grid>
        )}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <IconButton
            color="primary"
            size="large"
            disabled={activeIndex == 0}
            onClick={() => handlePageChange("PrevPage")}
          >
            <ChevronLeft />
          </IconButton>

          <span
            style={{
              borderRadius: "6px",
              padding: "3px 8px",
              color: "white",
              backgroundColor: "#00a278",
            }}
          >
            {activeIndex + 1}
          </span>
          <IconButton
            color="primary"
            size="large"
            disabled={activeIndex == numberOfPages - 1}
            onClick={() => handlePageChange("NextPage")}
          >
            <ChevronRight />
          </IconButton>
        </Box>
        {filteredItems.length == 0 && items.length !== 0 && (
          <Box className="loading">
            <SentimentDissatisfied />
            <h4>No products found</h4>
          </Box>
        )}
      </Grid>
      {/*Display the Cart component */}
      {/* <Grid
          container
          sx={{
            width: { md: "25%" },
            justifyContent: { md: "end" },
            alignItems: "flex-start",
            background: "#E9F5E1",
          }}
        >
          {isLoggedIn && (
            <Cart
              products={items}
              cartItems={cartItems}
              handleQuantity={addToCart}
            />
          )}
        </Grid> */}

      <Footer />
    </div>
  );
};

export default Products;
