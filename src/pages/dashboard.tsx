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
} from "recharts";
import axios from "axios";
import { api } from "../utils/api";

interface IDataProps {
  date: string;
  commitCount: number;
}

export default function Repos() {
  const session = useSession();

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
    void fetchCommitsPerDay.mutate({ number: 3 });
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div className="flex flex-col gap-8">
          <div className="flex gap-8">
            <div className="mt-2 p-2 shadow-lg">
              <div>Your Commmits</div>
              <LineChart width={800} height={400} data={data}>
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commitCount" stroke="#8884d8" />
                {/* <Line type="monotone" dataKey="date" stroke="#d8a684" /> */}
              </LineChart>
            </div>

            <div>something</div>
          </div>
          <div>Recent Commits</div>
        </div>
      </div>
    </div>
  );
}
