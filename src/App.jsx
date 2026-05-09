import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import BrowseFoods from "./pages/BrowseFoods";
import FoodDetails from "./pages/FoodDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddFood from "./pages/AddFood";
import MyFoods from "./pages/MyFoods";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Cart from "./pages/Cart";
import ReviewPage from "./pages/ReviewPage";
import SellerOrders from "./pages/SellerOrders";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food" element={<BrowseFoods />} />
        <Route path="/food/:id" element={<FoodDetails />} />
<Route path="/wishlist" element={<Wishlist />} />
<Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />

        {/* SELLER */}
        <Route path="/seller-orders" element={<SellerOrders />} />
        <Route path="/myfoods" element={<MyFoods />} />
        <Route path="/dashboard" element={<AddFood />} />
        {/* REVIEW */}
        <Route path="/review/:foodId" element={<ReviewPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;