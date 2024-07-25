import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";
import { PieChart } from "react-minimal-pie-chart";
import { useSession } from "next-auth/react";
import router from "next/router";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: 1, value: 2 , value2:108.},
  { name: 2, value: 5.5, value2:3 },
  { name: 3, value: 2 , value2:3},
  { name: 5, value: 8.5, value2:3 },
  { name: 8, value: 1.5 },
  { name: 100, value: 5 },
  { name: 1, value: 102 },
];

export default function Repos() {
  const session = useSession();

  useEffect(() => {
    async function func() {
      if (session.status !== "authenticated") {
        await router.push("/");
      }
    }

    void func();
  }, []);
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>
          <div>
            <h2>Your Commmits</h2>
            <LineChart width={800} height={600} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              <Line type="monotone" dataKey="value2" stroke="#d8a684" />
            </LineChart>
            
          </div>
        </div>
      </div>
    </div>
  );
}
