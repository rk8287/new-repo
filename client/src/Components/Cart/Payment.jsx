import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
import { AiOutlineCreditCard } from "react-icons/ai";
import { BsCalendar3EventFill } from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";
import { clearErrors } from "../../actions/userAction";
import MetaData from "../Layout/MetaData";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../actions/orderAction";

const Payment = () => {
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
    const apiUrl = 'https://my-ecommerce-xwc5.onrender.com/api/v1';

  const [stripeApiKey, setStripeApiKey] = useState(""); // Added state for the Stripe API key

  const fetchStripeApiKey = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stripeapikey`); // Replace 'your-api-url'
      setStripeApiKey(response.data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
      // Handle the error gracefully
    }
  };

  useEffect(() => {
    fetchStripeApiKey(); // Fetch the Stripe API key when the component mounts
  }, []);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    if (!stripe || !elements || !stripeApiKey) {
      return;
    }

    // Initialize Stripe with the Stripe API key
    const stripeInstance = stripe(stripeApiKey);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${apiUrl}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      const result = await stripeInstance.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <AiOutlineCreditCard />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <BsCalendar3EventFill />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <MdVpnKey />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};


export default Payment;
