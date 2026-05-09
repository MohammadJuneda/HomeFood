import { useState, useEffect } from "react";
import pickles_up from "../assets/pickles_up.png";
import healthy_up from "../assets/healthy_up.png";
import snacks_up from "../assets/snacks_up.png";
const banners = [
  { img: healthy_up, text: "Healthy Homemade Snacks" },
  { img: pickles_up, text: "Traditional Pickles" },
   { img: snacks_up, text: "Homemade Snacks" },
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[420px] bg-[#f8f5f2] flex items-center justify-center overflow-hidden relative z-0">

      <img
        src={banners[index].img}
        className="max-h-full max-w-full object-contain"
      />

      {/* FIX HERE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-white text-3xl font-bold bg-black/50 px-6 py-2 rounded">
          {banners[index].text}
        </h2>
      </div>

    </div>
  );
};

export default Banner;