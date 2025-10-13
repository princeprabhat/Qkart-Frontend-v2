import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  /**
   * @param {{ email: string, password: string }} formData
   */

  const login = async (formData) => {
    setLoader(true);
    const url = config.endpoint + "/auth/login";
    const { email, password } = formData;

    await axios
      .post(url, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          persistLogin(
            res.data.tokens.access.token,
            res.data.user.name,
            res.data.user.walletMoney,
            res.data.user["_id"],
            res.data.user.isAdmin
          );
          enqueueSnackbar("Logged in successfully", { variant: "success" });
          setLoader(false);
          setEmail("");
          setPassword("");
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status) {
          enqueueSnackbar(err.response.data.Error, { variant: "error" });
          setLoader(false);
        } else {
          enqueueSnackbar(err.message, {
            variant: "error",
          });
          setLoader(false);
        }
      });
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    const { email, password } = data;

    if (email === "") {
      enqueueSnackbar("Email is a required field", { variant: "warning" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      enqueueSnackbar("Email is not valid", {
        variant: "warning",
      });
      return false;
    }

    if (password === "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  /**
   
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Name of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
 
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, name, balance, id, adminUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    localStorage.setItem("balance", balance);
    localStorage.setItem("userId", id);
    localStorage.setItem("isAdmin", adminUser);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="email"
            label="email"
            variant="outlined"
            title="Email"
            name="email"
            value={getEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter Your Email"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={getPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            fullWidth
            placeholder="Enter password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {!loader ? (
            <Button
              className="button"
              variant="contained"
              onClick={() => {
                if (
                  validateInput({
                    email: getEmail,
                    password: getPassword,
                  })
                ) {
                  login({ email: getEmail, password: getPassword });
                }
              }}
            >
              LOGIN TO QKART
            </Button>
          ) : (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
