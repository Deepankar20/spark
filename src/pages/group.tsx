import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Navbar } from "../components/Navbar";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import LeftSideBar from "../components/leftSideBar";
import { useRecoilState } from "recoil";
import { leftSideBarSelect } from "../atoms/leftSIdeBarSelect";
import Image from "next/legacy/image";
import { compareAsc } from "date-fns";
import { useSession } from "next-auth/react";

interface IMembersProps {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  groupId: string | null;
}

interface IGroupProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  group_name: string;
  description: string | null;
  group_picture: string | null;
  createdBy: string;
}

interface IDataProps {
  date: string;
  commitCount: number;
}

const Popup = ({
  isOpen,
  onClose,
  groupId,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}) => {
  const link = `https://spark-red-two.vercel.app/join?g=${groupId}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div className="relative rounded-lg bg-white p-6 shadow-lg">
        <button className="absolute right-2 top-2 text-xl" onClick={onClose}>
          &times;
        </button>
        <p className="mb-4">Copy Link To Add Member</p>
        <input
          type="text"
          value={link}
          readOnly
          className="mb-4 w-full rounded-md border p-2"
        />
        <button
          onClick={copyToClipboard}
          className="rounded-md bg-[#291334] px-4 py-2 text-[#FAF7F5] hover:bg-[#291334]"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default function Group() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const [selected, setSelected] = useRecoilState(leftSideBarSelect);
  setSelected("Groups");
  const groupId = useSearchParams().get("g");
  const [groupStat, setGroupStat] = useState<IDataProps[]>();
  const [data, setData] =
    useState<{ date: any; user1Commits: any; user2Commits: any }[]>();
  console.log(data);

  const [compare, setCompare] = useState(false);
  const [compareMember, setCompareMember] = useState<IMembersProps>();
  console.log(compare);
  const session = useSession();

  const [members, setMembers] = useState<IMembersProps[]>();
  const [allMembersCommits, setAllMembersCommmits] = useState<
    { date: string; commitCount: number }[][]
  >([]);

  const [group, setGroup] = useState<IGroupProps>();

  const getAllMembers = api.group.getAllMembers.useMutation({
    onSuccess: async (data) => {
      if (data.code === 201 && data.data) {
        await setMembers(data.data);
      }
    },
  });

  const compareCommits = api.commit.compareCommits.useMutation({
    onSuccess: (data) => {
      if (data.data && data.code === 201) {
        data.data && setData(data.data);
      }
    },
  });

  const fetchCommitsPerDay = api.commit.getCommitsPerDay.useMutation({
    onSuccess: async (data) => {
      if (data.code === 201 && data.data) {
        data.data && setAllMembersCommmits((prev) => [...prev, data.data]);
      }
    },
  });

  const getGroup = api.group.getGroupById.useMutation({
    onSuccess: (data) => {
      if (data.code === 201 && data.data) {
        setGroup(data.data);
      }
    },
  });

  function formatGroupData() {
    setCompare(false);
    const combinedData = allMembersCommits.flat();

    const result = combinedData.reduce((acc, obj) => {
      const { date, commitCount } = obj;

      const existing: IDataProps | undefined = acc.find(
        (item: IDataProps) => item.date === date
      );

      if (existing) {
        //@ts-ignore
        existing.commitCount += commitCount;
      } else {
        //@ts-ignore
        acc.push({ date, commitCount });
      }

      return acc;
    }, []);

    setGroupStat(result);
  }

  useEffect(() => {
    async function render() {
      if (groupId) {
        getGroup.mutate({ groupId });
        getAllMembers.mutate({ groupId });
      }
    }

    render();
  }, [groupId]);

  useEffect(() => {
    if (members) {
      members.map((member): any => {
        fetchCommitsPerDay.mutate({ userId: member.id, number: 6 });
      });
    }
  }, [members]);

  useEffect(() => {
    formatGroupData();
  }, []);

  async function handleCompare() {
    if (session.data && compareMember)
      compareCommits.mutate({
        user1Id: session.data.user.id,
        user2Id: compareMember.id,
        number: 6,
      });
  }
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-8">
        <LeftSideBar />
        <div className="flex flex-grow flex-col gap-4 p-16">
          <Popup
            isOpen={isPopupOpen}
            onClose={closePopup}
            groupId={groupId as string}
          />
          {group && <div className="text-4xl">{group.group_name}</div>}
          <button
            className="w-[12rem] border border-[#291334] p-2 hover:bg-[#291334] hover:text-[#FAF7F5]"
            onClick={formatGroupData}
          >
            Show Group Stat
          </button>
          <button
            className="w-[12rem] border border-[#291334] p-2 hover:bg-[#291334] hover:text-[#FAF7F5]"
            onClick={() => setPopupOpen(true)}
          >
            add member
          </button>
          <div className="mt-2 h-1/2 w-full p-8 shadow-xl">
            {compare ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 16 }} />
                  <YAxis
                    tickFormatter={(tick) =>
                      Number.isInteger(tick) ? tick : ""
                    }
                    tick={{ fontSize: 16 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="user1Commits"
                    stroke="#190eec"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="user2Commits"
                    stroke="rgb(217, 45, 30)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={groupStat}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 16 }} />
                  <YAxis
                    tickFormatter={(tick) =>
                      Number.isInteger(tick) ? tick : ""
                    }
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
            )}
          </div>

          <div className="text-2xl">Compare with group members </div>

          <div className="flex h-[12rem] w-1/2  flex-col gap-4 overflow-y-auto">
            {members?.map((member) => {
              return (
                <div className="flex items-center justify-between p-4 shadow-lg">
                  <Image
                    src={member.image as string}
                    width={"50"}
                    height={"50"}
                    alt=""
                    className="rounded-full"
                  />
                  <div>{member.name}</div>
                  <button
                    onClick={() => {
                      setCompare(true);
                      setCompareMember(member);
                      handleCompare();
                    }}
                    className="border border-[#291334] p-4"
                  >
                    compare
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
