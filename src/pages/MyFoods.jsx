import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import FoodCard from "../components/FoodCard";
import toast from "react-hot-toast";

const MyFoods = () => {
  const [foods, setFoods] = useState([]);
  const [editFood, setEditFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // 📦 FETCH FOODS
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/food/myfoods");
      setFoods(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // 🗑 DELETE
  const deleteFood = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/food/${id}`);
      toast.success("Food deleted");
      fetchFoods();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ✏ UPDATE
  const handleUpdate = async () => {
    if (editFood.stock < 0) {
      return toast.error("Stock cannot be negative");
    }

    setUpdating(true);
    try {
      await axios.put(`/food/${editFood._id}`, editFood);
      toast.success("Updated successfully");
      setEditFood(null);
      fetchFoods();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        My Foods (Seller Dashboard)
      </h1>

      {/* 🔄 LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading foods...</p>
      )}

      {/* ❌ EMPTY STATE */}
      {!loading && foods.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No foods added yet 🍽️</p>
          <p className="text-sm">Start by adding your first food item</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {foods.map((food) => (
          <div key={food._id} className="relative">

            {/* CARD */}
            <FoodCard food={food} />

            {/* STOCK */}
            <div className="px-2 mt-2">
              <p className="text-sm font-medium">
                Stock: {food.stock}
              </p>

              {food.stock === 0 && (
                <p className="text-red-500 text-sm">
                  Out of Stock
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="absolute top-2 right-2 flex gap-2">

              <button
                onClick={() => setEditFood(food)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-sm rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteFood(food._id)}
                disabled={deletingId === food._id}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded disabled:opacity-50"
              >
                {deletingId === food._id ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}
      {editFood && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-lg w-96 shadow-lg overflow-y-auto max-h-[90vh]">

           <h2 className="text-xl font-bold mb-4">Edit Food</h2>

{/* NAME */}
<div className="mb-2">
  <label className="text-sm font-medium">Food Name</label>
  <input
    className="border w-full p-2 rounded"
    value={editFood.name}
    onChange={(e) =>
      setEditFood({ ...editFood, name: e.target.value })
    }
  />
</div>

{/* DESCRIPTION */}
<div className="mb-2">
  <label className="text-sm font-medium">Description</label>
  <input
    className="border w-full p-2 rounded"
    value={editFood.description}
    onChange={(e) =>
      setEditFood({ ...editFood, description: e.target.value })
    }
  />
</div>

{/* IMAGE */}
<div className="mb-2">
  <label className="text-sm font-medium">Image URL</label>
  <input
    className="border w-full p-2 rounded"
    value={editFood.image}
    onChange={(e) =>
      setEditFood({ ...editFood, image: e.target.value })
    }
  />
</div>

{/* CATEGORY */}
<div className="mb-2">
  <label className="text-sm font-medium">Category</label>
  <select
    className="border w-full p-2 rounded"
    value={editFood.category}
    onChange={(e) =>
      setEditFood({ ...editFood, category: e.target.value })
    }
  >
    <option value="">Select Category</option>
    <option value="Pickles">Pickles</option>
    <option value="Snacks">Snacks</option>
    <option value="Sweets">Sweets</option>
    <option value="Healthy Food">Healthy Food</option>
    <option value="Traditional Food">Traditional Food</option>
  </select>
</div>

{/* QUANTITY */}
<div className="mb-2">
  <label className="text-sm font-medium">Quantity</label>
  <input
    type="number"
    className="border w-full p-2 rounded"
    value={editFood.quantity}
    onChange={(e) =>
      setEditFood({ ...editFood, quantity: e.target.value })
    }
  />
</div>

{/* UNIT */}
<div className="mb-2">
  <label className="text-sm font-medium">Unit</label>
  <select
    className="border w-full p-2 rounded"
    value={editFood.unit}
    onChange={(e) =>
      setEditFood({ ...editFood, unit: e.target.value })
    }
  >
    <option value="">Select Unit</option>
    <option value="grams">grams</option>
    <option value="kg">kg</option>
    <option value="litre">litre</option>
    <option value="pieces">pieces</option>
  </select>
</div>

{/* STOCK */}
<div className="mb-2">
  <label className="text-sm font-medium">Stock</label>
  <input
    type="number"
    className="border w-full p-2 rounded"
    value={editFood.stock}
    onChange={(e) =>
      setEditFood({
        ...editFood,
        stock: Number(e.target.value),
      })
    }
  />
</div>

{/* PRICE */}
<div className="mb-3">
  <label className="text-sm font-medium">Price (₹)</label>
  <input
    type="number"
    className="border w-full p-2 rounded"
    value={editFood.price}
    onChange={(e) =>
      setEditFood({ ...editFood, price: e.target.value })
    }
  />
</div>

            {/* BUTTONS */}
            <div className="flex justify-between">

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditFood(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MyFoods;