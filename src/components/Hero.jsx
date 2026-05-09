import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-orange-100 py-20 text-center">

      <h1 className="text-4xl font-bold">
        Discover Homemade Foods
      </h1>

      <p className="mt-4 text-gray-600">
        Buy delicious homemade food directly from home chefs
      </p>

      <Link
        to="/foods"
        className="inline-block mt-6 bg-orange-500 px-6 py-3 rounded text-white font-semibold hover:bg-orange-600"
      >
        Browse Foods
      </Link>

    </div>
  );
};

export default Hero;