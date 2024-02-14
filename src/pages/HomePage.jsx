import React, { useState, useEffect, memo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiLoader4Line } from "react-icons/ri";
import { Rating } from "@mui/material";

const limitDescription = (description, maxLength = 80) => {
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + "...";
  }
  return description;
};

// Memoize ProductCard component to optimize rendering -> 
//preventing unnecessary re-renders when its props have not changed.
const ProductCard = memo(({ product, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white p-2 border rounded-lg flex flex-col justify-center items-center">
      <img
        src={product.images[0]}
        alt="productimage"
        className="h-[100px] w-[100px] "
      />
      <div className="text-center">
        <p className="font-bold mt-2">{product.title}</p>
        <Rating value={product.rating} readOnly />
        <p className="text-sm text-gray-500">
          {limitDescription(product.description)}
        </p>
        <p className="text-xl text-gray-600 font-bold"> ₹{product.price}</p>
        <button
          className="w-full cursor-pointer bg-gray-800 text-white h-8 mt-4 text-sm"
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
});


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;
      cart.forEach((item) => {
        total += item.price;
      });
      setTotalAmount(total);
    };
    calculateTotalAmount();
  }, [cart]);

  const fetchProducts = () => {
    setIsLoading(true);
    let apiUrl = "https://dummyjson.com/products";
    if (searchQuery) {
      apiUrl += `/search?q=${searchQuery}`;
    }
    if (minPrice && maxPrice) {
      apiUrl += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [minPrice, maxPrice]);

  const handleSearch = () => {
    fetchProducts();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartCount(cartCount + 1);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <div className="flex flex-col md:flex-row mt-6">
        <div className="md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <input
            className="focus:outline-none w-full md:w-[300px] border h-8 border-gray-200"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="h-8 w-full md:w-[140px] text-white text-sm bg-gray-800 mt-2 md:mt-0"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center items-center space-x-4">
          <input
            type="number"
            className="focus:outline-none w-20 border h-8 border-gray-200"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="focus:outline-none w-20 border h-8 border-gray-200"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button
            className="h-8 w-[60px] text-white text-sm bg-gray-800"
            onClick={handleSearch}
          >
            Filter
          </button>
        </div>
      </div>
      <div className="m-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex items-center">
            <span className="text-gray-500">
              Cart Count: {cartCount}, Total Amount: ₹{totalAmount}
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <RiLoader4Line className="animate-spin mr-2" /> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  addToCart={addToCart}
                />
              ))
            ) : (
              <p className="text-2xl text-center text-gray-500">
                Product not found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
