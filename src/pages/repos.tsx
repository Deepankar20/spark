import { useSession } from "next-auth/react";
import { Navbar } from "../components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../utils/api";
import LeftSideBar from "../components/leftSideBar";

const Dashboard = () => {
  const { data } = useSession();
  const [accessToken, setAccessToken] = useState<string>("");
  const [repositories, setRepositories] = useState([]);

  const router = useRouter();
  console.log(accessToken);

  const getAccessToken = api.user.getAccessToken.useMutation({
    onSuccess: (data) => {
      if (data.code == 201) {
        setAccessToken(data.data as string);
      }
    },
  });

  useEffect(() => {
    const repos = async () => {
      if (data?.user.id) {
        await getAccessToken.mutateAsync({ id: data?.user.id });
      }
    };
    void repos();
  }, []);

  useEffect(() => {
    const func = async () => {
      if (!data) {
        await router.push("/");
      }
    };

    void func();
  }, [data, router]);

  const fectchAllRepos = async () => {
    try {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      setRepositories(response.data as []);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col text-center">
      <Navbar />

      <div className="flex gap-16">
        <LeftSideBar />
        <div className="flex flex-col text-center">
          <button onClick={() => void fectchAllRepos()}>Fetch All Repos</button>

          <div className="mt-[2rem] flex flex-col items-center">
            <div className="max-auto flex max-h-[16rem] w-[48rem]  flex-col overflow-y-auto border border-black">
              {repositories && (
                <div>
                  {repositories.map((repo: { name: string }, i) => {
                    return (
                      <div
                        className="h-[5rem] rounded-lg border-b border-black p-2"
                        key={i}
                      >
                        {repo.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
