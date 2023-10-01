import './App.css';
import {  BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'; // Add React to import statement
import Header from './Components/Layout/Header/Header';
import Footer from './Components/Layout/Footer/Footer';
import Home from './Components/Home/Home';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Products from './Components/Products/Products';
import Search from './Components/Search/Search';
import store from './store';
import { loadUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from "./Components/Layout/Header/userOptions";
import '../src/Components/Layout/Header/Header.css'
import Profile from './Components/User/Profile';
import UpdateProfile from './Components/User/UpdateProfile';
import UpdatePassword from './Components/User/UpdatePassword';
import Cart from './Components/Cart/Cart';
import Shipping from './Components/Cart/Shipping';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import axios from 'axios';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from './Components/Cart/Payment';
import OrderSuccess from './Components/Cart/OrderSuccess';
import MyOrders from './Components/Order/MyOrders';
import LoginSignUp from './Components/User/LoginSignup';
import OrderDetails from './Components/Order/OrderDetails';
import Dashboard from './Components/Admin/Dashboard';
import ProductList from './Components/Admin/ProductList';
import NewProduct from './Components/Admin/NewProduct';
import ProcessOrder from './Components/Admin/ProcessOrder';
import OrderList from './Components/Admin/OrderList';
import UpdateProduct from './Components/Admin/UpdateProduct';
import UsersList from './Components/Admin/UserList';
import UpdateUser from './Components/Admin/UpdateUser';
import ProductReviews from './Components/Admin/ProductReviews';


function App() {
 

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
 
  
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      // Handle the error here
      console.error("Error fetching Stripe API key:", error);
    }
  }


  const stripePromise = loadStripe(stripeApiKey);

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  
  return (
    <Router>
      <Header />
  
      {isAuthenticated && <UserOptions  user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        {/* For Search */}
        <Route path="/products/:keyword" element={<Products />} key="search-results" />
        <Route path="/search" element={<Search />} />
        <Route path="/LoginSignup" element={<LoginSignUp />} />
        <Route path="/account" element={isAuthenticated ? <Profile user={user} /> : null} />
        <Route path="/me/update" element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/" />} />
        <Route path="/password/update" element={isAuthenticated ? <UpdatePassword /> : <Navigate to="/" />} />
        <Route path='/Cart' element={ <Cart/>}/>
        <Route path="/shipping" element={isAuthenticated ? <Shipping /> : <Navigate to="/" />} />
        <Route path="/order/confirm" element={isAuthenticated ? <ConfirmOrder /> : <Navigate to="/" />} />
        <Route path="/orders" element={isAuthenticated ? <MyOrders /> : <Navigate to="/" />} />
        <Route path="/order/:id" element={isAuthenticated ? <OrderDetails /> : <Navigate to="/" />} />
          {stripeApiKey && (
      <Route
      
      path="/process/payment"
    element={
      <Elements stripe={stripePromise}>
       {isAuthenticated ? <Payment /> : <Navigate to="/order/confirm" />}
      </Elements>
    }
  />
)}

<Route path="/success" element={isAuthenticated ? <OrderSuccess /> : <Navigate to="/order/confirm" />} />
<Route path="/admin/dashboard" element={ isAuthenticated ? <Dashboard /> : <Navigate to="/LoginSignup" />} />
<Route path="/admin/products" element={isAuthenticated ? <ProductList /> : <Navigate to="/account" />} />
<Route path="/admin/newProduct" element={isAuthenticated ? <NewProduct /> : <Navigate to="/account" />} />
<Route path="/admin/product/:id" element={isAuthenticated ? <UpdateProduct /> : <Navigate to="/account" />} />
<Route path="/admin/orders" element={isAuthenticated ? <OrderList /> : <Navigate to="/account" />} />
<Route path="/admin/order/:id" element={isAuthenticated ? <ProcessOrder /> : <Navigate to="/account" />} />
<Route path="/admin/users" element={isAuthenticated ? <UsersList /> : <Navigate to="/account" />} />
<Route path="/admin/user/:id" element={isAuthenticated ? <UpdateUser /> : <Navigate to="/account" />} />
<Route path="/admin/reviews" element={isAuthenticated ? <ProductReviews /> : <Navigate to="/account" />} />


      
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
