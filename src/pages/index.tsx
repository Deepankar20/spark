import { Hero } from "../components/LandingPage/Hero";
import { Navbar } from "../components/LandingPage/Navbar";
import { signIn, useSession } from "next-auth/react";

const Home = () => {
  const { data } = useSession();
  console.log(data);
  
  return (
    <div className="flex flex-col text-center">
      <Navbar />
      <Hero />
      <button onClick={() => void signIn()}>signin</button>
    </div>
  );
};

export default Home;
