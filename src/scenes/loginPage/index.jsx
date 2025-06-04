import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box
      width="100%"
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign="center"
    >
      <Box>
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          EDNOX
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1rem" }}>
          Welcome to EDNOX, the Social Media for Sociopaths!
        </Typography>

        {/* Guest Credentials Box */}
        {/* <Box
          p="1rem"
          mb="1.5rem"
          borderRadius="0.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography variant="body1" fontWeight="500" fontSize="25px">
            Use Guest Credentials:
          </Typography>
          <Typography variant="h5">
            <span role="img" aria-label="email">
              ✉️
            </span>{" "}
            Email: guest@gmail.com
          </Typography>
          <Typography variant="h5">
            <span role="img" aria-label="key">
              🔑
            </span>{" "}
            Password: 1234
          </Typography>{" "}
        </Box> */}

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
