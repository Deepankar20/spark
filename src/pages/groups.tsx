import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";

export default function Groups() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>groups</div>
      </div>
    </div>
  );
}
