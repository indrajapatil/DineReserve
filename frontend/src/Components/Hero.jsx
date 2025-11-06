import React from "react";
import bgImg from "../assets/food1.webp";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/reservation/book')   
  }
  return (
    <div
      className="relative h-[100vh] w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-30 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h2 className="text-lg md:text-xl mb-4 tracking-windest uppercase">
          Where Luxury meets Dinner{" "}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">INDRAJA BISTRO</h1>
        <button
          className="bg-amber-400 text-black p-4 font-bold px-6 rounded-lg hover:bg-amber-500 transition border-none"
          onClick={handleSubmit}
        >
          Book a Table
        </button>
      </div>
    </div>
  );
};

export default Hero;
