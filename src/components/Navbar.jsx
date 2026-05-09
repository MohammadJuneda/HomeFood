import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "../utils/axiosConfig";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔍 SEARCH
  const handleSearchChange = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get("/food");

      const filtered = res.data.filter((food) =>
        food.name.toLowerCase().includes(value.toLowerCase())
      );

      setResults(filtered.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/food?search=${search}`);
    setResults([]);
  };

  // ❌ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#5F8FA3] text-white px-6 py-3 flex justify-between items-center">

      {/* LOGO */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        HomeFood
      </h1>

      {/* SEARCH */}
      <div ref={searchRef} className="relative w-[350px]">

        <div className="flex items-center bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search homemade food..."
            className="px-3 py-2 w-full text-black outline-none"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button
            onClick={handleSearch}
            className="bg-[#5F8FA3] px-4 py-2 hover:bg-[#4A7C91]"
          >
            Search
          </button>
        </div>

        {/* DROPDOWN */}
        {results.length > 0 && (
          <div className="absolute bg-white text-black w-full mt-1 rounded shadow z-50">

            {results.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  navigate(`/food/${item._id}`);
                  setResults([]);
                  setSearch("");
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </div>
            ))}

          </div>
        )}

      </div>

      {/* LINKS */}
      <div className="flex items-center gap-5">
        <Link to="/">Home</Link>
        <Link to="/food">Browse</Link>

        <Link to="/cart" className="flex items-center gap-1">
          <FaShoppingCart /> Cart
        </Link>

        <Link to="/wishlist" className="flex items-center gap-1">
          <FaHeart className="text-red-400" /> Wishlist
        </Link>

        {user ? (
  <div
    onClick={() => navigate("/account")}
    className="bg-white text-[#5F8FA3] px-3 py-1 rounded-full cursor-pointer"
  >
    {user.name?.charAt(0).toUpperCase()}
  </div>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link
      to="/register"
      className="bg-white text-[#5F8FA3] px-3 py-1 rounded"
    >
      Register
    </Link>
  </>
)}
      </div>
    </nav>
  );
};

export default Navbar;