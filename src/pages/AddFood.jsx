import { useState } from "react";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const AddFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // ✅ NEW

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");

  // 📸 FILE UPLOAD
  const handleFile = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageUrl("");
    }
  };

  // 🌐 URL INPUT
  const handleUrl = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value);
    setImageFile(null);
  };

  // 🚀 ADD FOOD
  const addFood = async (e) => {
    e.preventDefault();

    try {
      let image = imageUrl;

      if (imageFile) {
        const reader = new FileReader();

        reader.onloadend = async () => {
          image = reader.result;
          await sendData(image);
        };

        reader.readAsDataURL(imageFile);
      } else {
        await sendData(image);
      }

    } catch (error) {
      toast.error("Error adding food");
      console.log(error);
    }
  };

  // ✅ SEND DATA
  const sendData = async (image) => {
    await axios.post("/food", {
      name,
      description,
      category,
      quantity,
      unit,
      price,
      stock: Number(stock) || 0, // ✅ IMPORTANT
      image,
    });

    toast.success("Food Added Successfully 🎉");

    // reset
    setName("");
    setDescription("");
    setCategory("");
    setQuantity("");
    setUnit("");
    setPrice("");
    setStock("");
    setImageFile(null);
    setImageUrl("");
    setPreview("");
  };

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        Add Food Items
      </h1>

      <form onSubmit={addFood} className="space-y-3">

        <input
          placeholder="Food Name"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 w-full"
        />

        <input
          placeholder="Or paste image URL"
          className="border p-2 w-full"
          value={imageUrl}
          onChange={handleUrl}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <select
          className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Pickles">Pickles</option>
          <option value="Snacks">Snacks</option>
          <option value="Sweets">Sweets</option>
          <option value="Healthy Food">Healthy Food</option>
          <option value="Traditional Food">Traditional Food</option>
        </select>

        <input
          type="number"
          placeholder="Quantity (e.g., 500)"
          className="border p-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        >
          <option value="">Select Unit</option>
          <option value="grams">grams</option>
          <option value="kg">kg</option>
          <option value="litre">litre</option>
          <option value="pieces">pieces</option>
        </select>

        {/* ✅ NEW STOCK FIELD */}
        <input
          type="number"
          placeholder="Stock (number of items available)"
          className="border p-2 w-full"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600">
          Add Food
        </button>

      </form>
    </div>
  );
};

export default AddFood;