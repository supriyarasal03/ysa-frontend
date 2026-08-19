import { useEffect } from "react";
import Hero from "../../components/home/Hero";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import SportsSection from "../../components/home/SportsSection";
import JoinAsCoach from "../../components/home/JoinAsCoach";
import Gallery from "../../components/home/Gallery";
import ContactSection from "../../components/home/ContactSection";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FloatingCall from "../../components/layout/FloatingCall";

const HomePage = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -80; // fixed navbar height
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <SportsSection />
      <JoinAsCoach />
      <Gallery />
      <ContactSection />
      <Footer />
      <FloatingCall />
    </>
  );
};

export default HomePage;