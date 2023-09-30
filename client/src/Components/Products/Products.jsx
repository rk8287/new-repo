import React, { Fragment, useEffect, useState } from 'react';
import { clearErrors, getProduct } from '../../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../Components/Product/Product';
import Loader from '../Layout/Loader/Loader';
import { Slider, Typography } from '@mui/material';
import MetaData from '../Layout/MetaData';
import '../Products/Products.css'
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify'; // Import the 'toast' function from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS for styling


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];



const Products = ({match}) => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 200000]);
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);


  const {keyword} = useParams()


  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);
  
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

                
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

                
         
          {resultPerPage < productsCount && (
                          
  <div className="paginationBox">
  <Pagination
    activePage={currentPage}
    itemsCountPerPage={resultPerPage}
    totalItemsCount={productsCount} // Make sure productsCount is passed here
    onChange={setCurrentPageNo}
    nextPageText="Next"
    prevPageText="Prev"
    firstPageText="1st"
    lastPageText="Last"
    itemClass="page-item"
    linkClass="page-link"
    activeClass="pageItemActive"
    activeLinkClass="pageLinkActive"
  />
</div>

                )}

     
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;