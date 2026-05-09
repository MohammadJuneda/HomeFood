import { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "customer",
  phone: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/register", formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success("Registered successfully 🎉");

      navigate("/"); // ✅ FIXED (removed reload)

    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Name" className="w-full border p-2" onChange={handleChange} />
        <input name="email" placeholder="Email" className="w-full border p-2" onChange={handleChange} />
        <input
  type="text"
  placeholder="Phone Number"
  className="w-full border p-2 rounded"
  value={formData.phone}
  onChange={(e) =>
    setFormData({
      ...formData,
      phone: e.target.value,
    })
  }
/>
        <input name="password" placeholder="Password" className="w-full border p-2" onChange={handleChange} />

        <select name="role" className="w-full border p-2" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <button className="w-full bg-orange-500 text-white py-2 rounded">
          Register
        </button>

      </form>
    </div>
  );
};

export default Register;