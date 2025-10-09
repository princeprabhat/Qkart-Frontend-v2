import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

import "./Header.css";

const Header = ({
  children,
  hasHiddenAuthButtons,
  IsLoggedIn,
  isAdmin = false,
}) => {
  const navigate = useNavigate();

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Box>{children}</Box>
      {!hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to explore
        </Button>
      )}
      {hasHiddenAuthButtons && !IsLoggedIn && (
        <Stack direction="row" spacing={2}>
          <Button
            className="explore-button"
            variant="text"
            onClick={() => {
              navigate("/login");
            }}
          >
            LOGIN
          </Button>
          <Button
            className=""
            variant="contained"
            onClick={() => {
              navigate("/register");
            }}
          >
            REGISTER
          </Button>
        </Stack>
      )}

      {hasHiddenAuthButtons && IsLoggedIn && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <div className="username-text">
            {/* <img src="avatar.png" alt={localStorage.getItem("username")} /> */}
            <PersonIcon />
            <span>
              {localStorage.getItem("username").slice(0, 2).toUpperCase()}
            </span>
          </div>
          {isAdmin == true && (
            <Button
              className="admin-button"
              variant="outlined"
              onClick={() => {}}
            >
              Admin
            </Button>
          )}

          <Button
            className="explore-button"
            variant="text"
            onClick={() => {
              localStorage.clear();
              navigate("/");
              window.location.reload();
            }}
          >
            LOGOUT
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
