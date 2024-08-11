import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";



export default function Join() {
  const user = useSession();
  const router = useRouter();

  const groupId = useSearchParams().get("g");
  
  const userId = user.data?.user.id;

  const addToGroup = api.group.addToGroup.useMutation({
    onSuccess: (data) => {
      if (data.code === 201) {
        console.log("Member Joined Successfully : ", data.data);
        router.push(`/group?g=${groupId}`);
      }
    },
  });

  const joinGroup = async () => {
    if (userId && groupId) {
      addToGroup.mutate({ userId, groupId });
    }
  };

  return (
    <div>
      <button onClick={joinGroup}>join this group</button>
    </div>
  );
}
