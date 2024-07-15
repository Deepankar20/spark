import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";

export default function Repos() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>
            No Repository Selected for analysis
        </div>
      </div>
    </div>
  );
}
