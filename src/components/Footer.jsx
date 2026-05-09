const Footer = () => {
  return (
    <div className="bg-[#5F8FA3] text-white py-8 mt-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        <div>
          <h3 className="font-bold mb-2">HomeFood</h3>
          <p>Delicious homemade meals delivered to your door.</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Links</h3>
          <p>Home</p>
          <p>Browse</p>
          <p>Cart</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p>support@homefood.com</p>
        </div>

      </div>

    </div>
  );
};

export default Footer;