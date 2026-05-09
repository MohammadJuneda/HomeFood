import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 bg-white p-4 rounded shadow">

        <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
        </div>

      </div>

      {/* MENU OPTIONS */}
      <div className="mt-6 bg-white rounded shadow divide-y">

        <MenuItem title="My Orders" onClick={() => navigate("/orders")} />

        {user?.role === "seller" && (
          <>
            <MenuItem title="Seller Orders" onClick={() => navigate("/seller-orders")} />
            <MenuItem title="My Foods" onClick={() => navigate("/myfoods")} />
            <MenuItem title="Add Food" onClick={() => navigate("/dashboard")} />
          </>
        )}

        <MenuItem title="Edit Profile" onClick={() => navigate("/profile")} />

        <MenuItem
          title="Logout"
          onClick={() => {
           localStorage.removeItem("user");
localStorage.removeItem("token");
            navigate("/");
          }}
        />

      </div>

    </div>
  );
};

// 🔥 REUSABLE COMPONENT
const MenuItem = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
  >
    <span className="font-medium">{title}</span>
    <span>›</span>
  </div>
);

export default Account;