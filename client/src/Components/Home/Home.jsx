import React, { Fragment, useEffect } from "react";
import { CgMouse } from 'react-icons/cg';
import MetaData from "../Layout/MetaData";
import "./Home.css";
import Product from "../Product/Product";
import { clearErrors, getProduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from "../Layout/Loader/Loader";
import { toast } from 'react-toastify'; // Import the 'toast' function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS for styling


const Home = () => {

  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(state => state.products);

  useEffect(() => {
    if(error){
      toast.error(error)
      dispatch(clearErrors())
   }
    dispatch(getProduct());
  }, [dispatch,error]);

  return (
    <Fragment>
      <MetaData title="Ecommerce" />
      {loading ? (
       <Loader/>
      ) : (
        <Fragment>
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products && products.map(product => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
