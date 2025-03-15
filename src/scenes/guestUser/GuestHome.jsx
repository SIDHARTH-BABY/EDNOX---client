import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import GuestPostWidge from "./GuestPostWidge";
import GuestNavbar from "./GuestNavbar";

const GuestHome = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <GuestNavbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          sx={{ position: "sticky", top: "5" }}
          flexBasis={isNonMobileScreens ? "26%" : undefined}
        >
          {/* <User /> */}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <GuestPostWidge/>
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%" sx={{ position: "sticky", top: "5" }}>
            {/* <FriendListWidget userId={_id} /> */}
            {/* <AdvertWidget /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GuestHome;
