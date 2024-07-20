import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";
import { PieChart } from "react-minimal-pie-chart";

export default function Repos() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>
          No Repository Selected for analysis
          {/* <PieChart
            data={[
              { title: "Commits (23)", value: 10, color: "#49e327" },
              { title: "Active day", value: 15, color: "#fa120a" },
              { title: "ramesh", value: 20, color: "#1280ff" },
              { title: "ramesh", value: 20, color: "#d7e5f5" },
            ]}
          /> */}
          
        </div>
      </div>
    </div>
  );
}
