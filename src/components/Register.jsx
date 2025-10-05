import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  //  @param {{ email: string, password: string, name: string }} formData
  const register = async (formData) => {
    setLoader(true);
    const url = config.endpoint + "/auth/register";
    const { email, password, name } = formData;

    await axios
      .post(url, {
        email: email,
        password: password,
        name: name,
      })
      .then((res) => {
        if (res.status === 201) {
          enqueueSnackbar("Registered Successfully", { variant: "success" });
          setLoader(false);
          setEmail("");
          setPassword("");
          setName("");
          navigate("/login");
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

  // @param {{ email: string, password: string, name: string }} data
  //  * @returns {boolean}

  const validateInput = (data) => {
    const { email, password, name } = data;
    if (name.length < 2) {
      enqueueSnackbar("Name must be at least 2 characters", {
        variant: "warning",
      });
      return false;
    }
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
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            title="Name"
            value={getName}
            onChange={(e) => {
              setName(e.target.value);
            }}
            name="name"
            placeholder="Enter Your Name"
            fullWidth
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            value={getEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            placeholder="Enter Your Email"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={getPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          {/* <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              SetConfirmPassword(e.target.value);
            }}
            type="password"
            fullWidth
          /> */}
          {loader ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={() => {
                if (
                  validateInput({
                    name: getName,
                    email: getEmail,
                    password: getPassword,
                  })
                ) {
                  register({
                    name: getName,
                    email: getEmail,
                    password: getPassword,
                  });
                }
              }}
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
