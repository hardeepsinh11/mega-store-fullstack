import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from "./pages/Login"
import Signup from './pages/Signup';
import AddProduct from './pages/AddProduct';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PRODUCT_CATEGORIES } from './constants/categories';
import { API_BASE_URL } from './config/api';


// --- 1. Navbar Component (Tailwind Style) ---
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    alert("Logout Successfully !");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
          🛍️ Mega Store
        </Link>
    
        {/* Links */}
        <div className="flex items-center gap-4 font-medium">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition sm:block ">Home</Link>

          {/* Admin Link */}
          {token && isAdmin && (
            <Link to="/admin" className="text-red-600 hover:text-red-800 transition">Add Product</Link>
          )}

          {/* Login / Logout Logic */}
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm text-sm"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// --- 2. Home Component (With Search & Grid Layout) ---
function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // 
  const navigate = useNavigate();

  const fetchProducts = () => {
    axios.get(`${API_BASE_URL}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const categories = ["All", ...PRODUCT_CATEGORIES];
  const handleBuy = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please Login to Buy! 🛒");
      navigate("/login");
      return;
    }
    try {
      // Backend 
      await axios.post(`${API_BASE_URL}/buy/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Purchase Succesfully🎉");
      fetchProducts(); 
    } catch (error) {
      console.error(error);
      alert (error.response?.data?.detail || "Error: Stock is Empty");
    }
  };

   const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Search & Filter Section */}
      <div className="bg-white py-8 shadow-sm mb-6 sticky top-60px ">
        <div className="container mx-auto flex flex-col items-center gap-4">

          {/* Search Bar */}
          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search items..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          />
          
          <div className="flex gap-2 overflow-x-auto w-full max-w-4xl justify-center px-4 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm
                  ${selectedCategory === cat
                    ? "bg-blue-600 text-white scale-105" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <h2 className="text-center text-xl text-gray-500 mt-10">Loading Products... ⏳</h2>
        ) : null}

        {filteredProducts.length === 0 && products.length > 0 ? (
          <h3 className="text-center text-xl text-gray-500 mt-10">No products match your search! 😕</h3>
        ) : (

         // Grid Layout:
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col justify-between  border border-gray-100 transform hover:-translate-y-1 "
              >

                {/* Image Section */}
                <div className="h-48 w-full overflow-hidden bg-gray-50 flex  items-center justify-center p-3">
                  <img
                    src={item.image_url || "https://via.placeholder.com/260x150"}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/260x150?text=No+Image" }}
                  />
                </div>

                {/* Content Section */}
                <div className="p-4  flex flex-col grow  justify-between">
                  <h3 className="text-base font-bold text-gray-800 mb-2 whitespace-normal line-clamp-2 min-h-12 ">{item.name}</h3>
                  {/*<p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>*/}

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3 gap-2">
                      <span className="text-lg  font-extrabold text-green-600">₹{item.price}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.stock > 0 ? `Stock: ${item.stock}` : "Out of Stock"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={item.stock <= 0}
                      className={`w-full py-2.5 rounded-xl font-bold text-white transition shadow-sx text-sm 
                        ${item.stock > 0
                          ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                          : "bg-gray-400 cursor-not-allowed"}`}
                    >
                      {item.stock > 0 ? "Buy Now  🛒" : "Sold Out ❌"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 3. Main App ---
function App() {
  return (
    <BrowserRouter>
     
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;