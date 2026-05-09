import { useNavigate } from "react-router-dom";

const categories = [
  "Pickles",
  "Snacks",
  "Sweets",
  "Healthy",
  "Traditional",
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 bg-[#F5FAFC] text-center">

      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      <div className="flex flex-wrap justify-center gap-4">

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/food?category=${cat}`)}
            className="bg-white px-6 py-3 rounded-xl shadow hover:shadow-md transition"
          >
            {cat}
          </button>
        ))}

      </div>
    </div>
  );
};

export default Categories;