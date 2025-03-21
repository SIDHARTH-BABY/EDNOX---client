import React from "react";
import { Link, useLocation } from "react-router-dom";
import FlexBetween from "../FlexBetween";
import WidgetWrapper from "../WidgetWrapper";
import "./adminsidebar.css";

const AdminSidebar = () => {



  const location = useLocation();
  const adminMenu = [
    {
      name: "Admin Dashboard",
      link: "/admin-dashboard",
    },
    {
      name: "User Manage",
      link: "/admin-home",
    },
    {
      name: "Post Manage",
      link: "/admin-post-report",
    },
  ];
  return (
    <WidgetWrapper>
      {/* FIRST ROW */}

      <FlexBetween  gap="2.5rem" pb="3.1rem">
        <div className="main">
          <div className="d-flex layout">
            <div className="sidebar">
              <div className="sidebar-header">
                <h1 className="logo">EDNOX</h1>
              </div>
              <div className="menu">
                {adminMenu.map((menu) => {
                  const isActive = location.pathname === menu.link; //location.pathname >>>>> useLocation lle field aanu
                  return (
                    <div
                      className={`d-flex menu-item ${isActive &&
                        "active-menu-item"}`}
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "white",
                        }}
                        to={menu.link}
                      >
                        {menu.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </FlexBetween>

      {/* FOURTH ROW */}
    </WidgetWrapper>
  );
};

export default AdminSidebar;
