import React, { Fragment, useState } from 'react';
import { Backdrop, SpeedDial, SpeedDialAction } from "@mui/material";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdPerson, MdExitToApp } from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/userAction';
import { toast } from 'react-toastify'; // Import the 'toast' function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS for styling
import {useNavigate} from 'react-router-dom'


const UserOptions = ({ user = {} }) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  
  const { cartItems } = useSelector((state) => state.cart);

  const options = [
    { icon: <RiFileList2Line />, name: "Orders", func: orders },
    { icon: <MdPerson />, name: "Profile", func: account },
    {
      icon: (
        <FaShoppingCart
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <MdExitToApp />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <LuLayoutDashboard />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function logoutUser() {
    dispatch(logout());
    toast.success("Logout Successfully");
    
  }

   function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function cart() {
    navigate("/cart");
  }


  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar?.url ? user.avatar.url : "https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
