import Banner from "../components/Banner";
import Categories from "../components/Categories";
import FeaturedFoods from "../components/FeaturedFoods";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-white">

      <Banner />
      <Categories />
      <FeaturedFoods />
      <Footer />

    </div>
  );
};

export default Home;