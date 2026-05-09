import { useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await axios.post("/auth/login", formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful ✅");

      navigate("/"); // ✅ FIXED

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={handleChange}
        />

        <button className="w-full bg-orange-500 text-white py-2 rounded">
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;