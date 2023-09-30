import React from 'react'
import { Link } from 'react-router-dom'
import ReactStar from 'react-rating-stars-component'

const Product = ({ product }) => {
  // Check if product or product.images is undefined before accessing properties
  if (!product || !product.images || product.images.length === 0) {
    return null; // or display some default content or loading indicator
  }

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true
  }

  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>

      <div>
        <ReactStar {...options} /> <span>({product.numOfReviews})</span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default Product
