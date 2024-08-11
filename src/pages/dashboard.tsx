import { useEffect, useState } from "react";
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
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { api } from "../utils/api";
import { useRecoilState } from "recoil";
import { leftSideBarSelect } from "../atoms/leftSIdeBarSelect";

interface IDataProps {
  date: string;
  commitCount: number;
}

export default function Repos() {
  const session = useSession();
  const [selected, setSelected] = useRecoilState(leftSideBarSelect);
  setSelected("Dashboard");

  const [data, setData] = useState<IDataProps[]>([]);
 

  const fetchCommitsPerDay = api.commit.getCommitsPerDay.useMutation({
    onSuccess: (data) => {
      if (data.code === 201) {
        data.data && setData(data.data);
      }
    },
  });

  useEffect(() => {
    async function func() {
      if (session.status !== "authenticated") {
        await router.push("/");
      }
    }

    

    //void fetchCommitsPerDay.mutateAsync;
    void func();
  }, []);

  useEffect(() => {
    if (session.data) {
      void fetchCommitsPerDay.mutate({
        number: 6,
        userId: session.data.user.id,
      });
    }
  }, []);



  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div className="flex flex-grow flex-col gap-8 p-16">
          <div className="mt-2 h-1/2 w-full p-8 shadow-xl">
            <div>Your Commits</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 16 }} />
                <YAxis
                  tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
                  tick={{ fontSize: 16 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="commitCount"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>Recent Commits</div>
        </div>
      </div>
    </div>
  );
}
