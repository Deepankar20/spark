import { useRouter } from "next/router";

export default function Dashboard() {
  const { groupId } = useRouter().query;
  return <div className="text-green-500">yo  {groupId}</div>;
}
