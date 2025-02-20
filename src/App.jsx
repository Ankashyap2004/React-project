import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [productData, setProductData] = useState([]);
  const [cartData, setCartData] = useState([]);

  // Fetch product data
  const btnClicked = async () => {
    const response = await axios.get("https://fakestoreapi.com/products");
    setProductData(response.data);
  };

  // Add product to cart (increase quantity if already in cart)
  const addToCart = (product) => {
    setCartData((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartData((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Decrease quantity (remove if quantity is 1)
  const decreaseQuantity = (productId) => {
    setCartData((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0) // Remove if quantity becomes 0
    );
  };

  // Calculate total amount
  const totalAmount = cartData.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-5 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛍️ FakeStore</h1>
        <button
          onClick={btnClicked}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 active:scale-95"
        >
          Load Products
        </button>
      </div>

      <div className="flex gap-5">
        {/* Product List */}
        <div className="w-3/4 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">🛒 Products</h2>
          <div className="grid grid-cols-4 gap-4">
            {productData.map((product) => (
              <div
                key={product.id}
                className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <img className="h-40 mx-auto" src={product.image} alt={product.title} />
                <h1 className="text-sm font-semibold mt-2 h-12 overflow-hidden">
                  {product.title}
                </h1>
                <p className="text-gray-600 font-medium mt-1">${product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-md w-full hover:bg-yellow-600 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-1/4 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">🛒 Your Cart</h2>
          {cartData.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <>
              {cartData.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 mb-3 bg-gray-50 rounded-lg shadow-md"
                >
                  <img className="h-12 w-12 object-contain" src={product.image} alt={product.title} />
                  <div className="flex-1 mx-3">
                    <h1 className="text-sm font-semibold">{product.title}</h1>
                    <p className="text-gray-600">Qty: {product.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
                    >
                      -
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Total Amount Section */}
              <div className="border-t pt-3 mt-4">
                <h3 className="text-lg font-semibold flex justify-between">
                  Total: <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                </h3>
                <button
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 active:scale-95"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
