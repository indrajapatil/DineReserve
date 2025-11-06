import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./Components/Navbar";
import Contact from "./Components/Contact";
import Reservation from "./Components/ReservationHistory";
import Footer from "./Components/Footer";
import ReservationForm from "./Components/ReservationForm";
import Menu from "./Components/Menu";
import Authform from "./Components/AuthForm";

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth" || location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Authform />} />
        <Route path="/auth" element={<Authform />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/reservation/book" element={<ReservationForm />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
};

export default App;
