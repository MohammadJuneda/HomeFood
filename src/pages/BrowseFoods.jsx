import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useLocation } from "react-router-dom";
import FoodCard from "../components/FoodCard";

const categories = ["All", "Pickles", "Snacks", "Sweets", "Healthy", "Traditional", "Meals"];

const BrowseFoods = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(1000);

  const location = useLocation();

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [foods, selectedCategory, sort, priceRange, location.search]);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("/food");
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const applyFilters = () => {
    let data = [...foods];

    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const categoryQuery = params.get("category");

    // 🔍 SEARCH
    if (search) {
      data = data.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 CATEGORY (URL)
    if (categoryQuery && categoryQuery !== "All") {
      data = data.filter((food) =>
        food.category?.toLowerCase().includes(categoryQuery.toLowerCase())
      );
    }

    // 📂 CATEGORY (BUTTON)
    if (selectedCategory !== "All") {
      data = data.filter((food) =>
        food.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // 💰 PRICE
    data = data.filter((food) => food.price <= priceRange);

    // 🔄 SORT
    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredFoods(data);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Browse Foods 🍽️</h1>

      {/* CATEGORY */}
      <div className="flex gap-2 flex-wrap mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm ${
              selectedCategory === cat
                ? "bg-[#5F8FA3] text-white"
                : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SORT */}
      <select
        onChange={(e) => setSort(e.target.value)}
        className="border px-3 py-1 rounded mb-4"
      >
        <option value="">Sort</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

      {/* PRICE */}
      <div className="mb-6">
        <label className="font-semibold">Max Price: ₹{priceRange}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* GRID */}
      {filteredFoods.length === 0 ? (
        <p className="text-gray-500 text-center">No foods found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}

    </div>
  );
};

export default BrowseFoods;