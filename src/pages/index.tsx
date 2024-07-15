import { Hero } from "../components/LandingPage/Hero";
import { Navbar } from "../components/LandingPage/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col text-center">
      <Navbar />
      <Hero/>
    </div>
  );
};

export default Home;
