import React from "react";

import { Navigate } from "react-router-dom";


function ProtectedRoute(props) {

  if (localStorage.getItem("admin-token")) {
    return props.children;
  } else {
    return <Navigate to="/admin" />;
  }
}

export default ProtectedRoute;