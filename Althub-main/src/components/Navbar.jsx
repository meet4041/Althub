import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";

export default function Navbar({ socket }) {
  const [state, setState] = React.useState({
    right: false,
  });
  const [user, setUser] = useState({});
  const [navbar, setNavbar] = useState(true);
  const { pathname } = window.location;
  // const pathname = window.location.pathname;
  const [mesDot, setMesDot] = useState(false);
  const [notDot, setNotDot] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const getUser = () => {
    const userID = localStorage.getItem("Althub_Id");
    axios({
      method: "get",
      url: `${WEB_URL}/api/searchUserById/${userID}`,
    })
      .then((Response) => {
        setUser(Response.data.data[0]);
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
  };

  const Logout = () => {
    localStorage.clear();
    nav("/");
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ color: "#7e7f81" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          alignItems: "center",
          fontSize: "30px",
          color: "black",
        }}
      >
        <i class="fa-solid fa-xmark"></i>
        <h4>Menubar</h4>
      </div>
      <Divider />
      <List>
        <ListItem
          key={"home"}
          disablePadding
          onClick={() => {
            nav("/home");
          }}
        >
          <ListItemButton>
            <i class="fa-solid fa-house" style={{ padding: "10px 15px" }}></i>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"search"}
          disablePadding
          onClick={() => {
            nav("/search-profile");
          }}
        >
          <ListItemButton>
            <i
              class="fa-solid fa-magnifying-glass"
              style={{ padding: "10px 15px" }}
            ></i>
            <ListItemText primary={"search"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"events"}
          disablePadding
          onClick={() => {
            nav("/events");
          }}
        >
          <ListItemButton>
            <i
              class="fa-solid fa-calendar"
              style={{ padding: "10px 15px" }}
            ></i>
            <ListItemText primary={"Events"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"message"}
          disablePadding
          onClick={() => {
            nav("/message");
          }}
        >
          <ListItemButton>
            <i class="fa-solid fa-message" style={{ padding: "10px 15px" }}></i>
            <ListItemText primary={"Message"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"helpstudent"}
          disablePadding
          onClick={() => {
            nav("/help-students");
          }}
        >
          <ListItemButton>
            <i class="fa-solid fa-handshake-angle" style={{ padding: "10px 15px" }}></i>
            <ListItemText primary={"Help Students"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"notification"}
          disablePadding
          onClick={() => {
            nav("/notification");
          }}
        >
          <ListItemButton>
            <i class="fa-solid fa-bell" style={{ padding: "10px 15px" }}></i>
            <ListItemText primary={"Notification"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          key={"feedback"}
          disablePadding
          onClick={() => {
            nav("/feedback");
          }}
        >
          <ListItemButton>
            <i
              className="fa-solid fa-star"
              style={{ padding: "10px 15px" }}
            ></i>
            <ListItemText primary={"Feedback"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"logout"} onClick={Logout} disablePadding>
          <ListItemButton>
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ padding: "10px 15px" }}
            ></i>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const nav = useNavigate();

  useEffect(() => {
    if (
      pathname === "/register" ||
      pathname === "/login" ||
      pathname === "/" ||
      pathname === "/forget-password" ||
      pathname === "/new-password"
    ) {
      setNavbar(false);
    } else {
      setNavbar(true);
      getUser();
    }
    socket.emit("addUser", localStorage.getItem("Althub_Id"));
    socket.on("getMessage", (data) => {
      setMesDot(true); if (pathname === "/message") {
        setMesDot(false);
      }
    });
    socket.on("getNotification", (data) => {
      setNotDot(true);
      if (pathname === "/notification") {
        setNotDot(false);
      }
    });


  }, [pathname, socket]);

  return (
    <>
      <nav class="navbar" style={{ display: navbar ? "flex" : "none" }}>
        <div class="navbar-left">
          <Link to="/home" class="logo">
            <img src="/images/Logo1.jpeg" alt="#" />
          </Link>
        </div>
        <div class="navbar-center">
          <ul>
            <Link to="/home">
              <li>
                <i class="fa-solid fa-house"></i>
                <span>Home</span>
              </li>
            </Link>
            <Link to="/search-profile">
              <li>
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Search</span>
              </li>
            </Link>
            <Link to="/events">
              <li>
                <i class="fa-solid fa-calendar"></i>
                <span>Events</span>
              </li>
            </Link>
            <Link to="/message">
              <li onClick={() => { setMesDot(false) }}>
                {mesDot ? <i
                  class="fa-solid fa-circle"
                  style={{
                    color: "#ff0000",
                    fontSize: "6px",
                    position: "absolute",
                    marginLeft: "20px",
                  }}
                ></i> : null}
                <i class="fa-solid fa-message"></i>
                <span>Message</span>
              </li>
            </Link>
            <Link to="/notification">
              <li onClick={() => { setNotDot(false) }}>
                {notDot ? <i
                  class="fa-solid fa-circle"
                  style={{
                    color: "#ff0000",
                    fontSize: "6px",
                    position: "absolute",
                    marginLeft: "16px",
                  }}
                ></i> : null}
                <i class="fa-solid fa-bell"></i>
                <span>Notification</span>
              </li>
            </Link>
          </ul>
        </div>
        <div class="navbar-right">
          <div
            className="nav-profile"
            onClick={() => {
              nav("/view-profile");
            }}
          >
            {user.profilepic ? (
              <img
                src={`${WEB_URL}${user.profilepic}`}
                alt=""
                class="nav-profile-img"
              />
            ) : (
              <img src="images/profile1.png" class="nav-profile-img" alt="#"></img>
            )}
            <div class="user-profile">
              {user.fname ? (
                <span>
                  {user.fname} {user.lname}
                </span>
              ) : (
                <span>USER</span>
              )}
            </div>
          </div>

          <div className="nav-search-bar">
            <React.Fragment>
              <Button onClick={toggleDrawer("right", true)}>
                <i class="fa-solid fa-bars"></i>
              </Button>
              <SwipeableDrawer
                anchor="right"
                open={state["right"]}
                onClose={toggleDrawer("right", false)}
                onOpen={toggleDrawer("right", true)}
              >
                {list("right")}
              </SwipeableDrawer>
            </React.Fragment>
          </div>
          <div></div>
        </div>
      </nav>
    </>
  );
}