import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import DonutChart from 'react-donut-chart';
import './Dashboard.css';
import MetaData from '../Layout/MetaData';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProduct } from '../../actions/productAction';
import { getAllOrders } from '../../actions/orderAction';
import { getAllUsers } from '../../actions/userAction';
import { Line } from 'react-chartjs-2'; // Import Line from react-chartjs-2
import 'chart.js/auto'; // Import 'chart.js/auto' to load Chart.js

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });
  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const doughnutData = [
    {
      label: 'Out of Stock',
      value: outOfStock,
    },
    {
      label: 'InStock',
      value: products
        ? products.reduce((count, item) => (item.stock > 0 ? count + 1 : count), 0)
        : 0,
      isEmpty: true,
    },
  ];

  const lineChartData = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className="doughnutChart">
          <DonutChart
            data={doughnutData}
            strokeWidth={25} // Adjust the stroke width as needed
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
