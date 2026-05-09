import { useState } from "react";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [password, setPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put("/auth/update-profile", {
        name,
        phone,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Profile updated ✅");

    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded-xl">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="text-gray-500 text-sm">
            {userData.email}
          </p>
        </div>

      </div>

      <h1 className="text-2xl font-bold mb-5">
        Update Profile
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="text-sm text-gray-600">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mt-1 focus:outline-orange-500"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">
            Email
          </label>

          <input
            type="email"
            value={userData.email}
            disabled
            className="w-full border p-2 rounded mt-1 bg-gray-100"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-600">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded mt-1 focus:outline-orange-500"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-gray-600">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mt-1 focus:outline-orange-500"
          />
        </div>

        {/* BUTTON */}
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
          Update Profile
        </button>

      </form>

    </div>
  );
};

export default Profile;