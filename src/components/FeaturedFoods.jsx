import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const FeaturedFoods = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await axios.get("/food");
    setFoods(res.data.slice(0, 6));
  };

  return (
    <div className="py-10 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Featured Foods
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/food/${food._id}`)}
          >
            <img
              src={food.image}
              className="h-48 w-full object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="font-semibold">{food.name}</h3>
              <p className="text-[#866b5e] font-bold">₹{food.price}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default FeaturedFoods;