import { useSession } from "next-auth/react";
import { Navbar } from "../components/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../utils/api";
import LeftSideBar from "../components/leftSideBar";
import { useRecoilState } from "recoil";
import { access_token } from "../atoms/access_token";

const Repos = () => {
  const { data } = useSession();
  const [accessToken, setAccessToken] = useRecoilState(access_token);

  const [repositories, setRepositories] = useState([]);

  const router = useRouter();

  const getAccessToken = api.user.getAccessToken.useMutation({
    onSuccess: (data) => {
      if (data.code == 201) {
        console.log(accessToken);

        setAccessToken(data.data as string);

        console.log(accessToken);
      }
    },
  });

  useEffect(() => {
    const repos = async () => {
      if (data?.user.id) {
        await getAccessToken.mutateAsync({ id: data?.user.id });
      }
    };
    console.log("getting accesstoken");

    void repos();
  }, [data]);

  useEffect(() => {
    const func = async () => {
      if (!data) {
        await router.push("/");
      }
    };

    void func();
  }, [data, router]);

  useEffect(() => {
    const fectchAllRepos = async () => {
      try {
        console.log(accessToken);

        const response = await axios.get("https://api.github.com/user/repos?per_page=100", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        setRepositories(response.data as []);
      } catch (error) {
        console.log(error);
      }
    };
    const func = async () => {
      await fectchAllRepos();
    };
    console.log("fetching repos");

    void func();
  }, [accessToken]);

  const handleSelect = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(e.target?.value);
  };

  return (
    <div className="flex flex-col text-center">
      <Navbar />

      <div className="flex gap-16">
        <LeftSideBar />
        <div className="flex w-2/3 flex-col items-center text-center">
          <div className="mt-[2rem] flex flex-col items-center ">
            Select Repositories To View Analysis
            <div className="mt-[2rem] flex h-[28rem] flex-col overflow-y-auto rounded-md shadow-lg lg:w-[40rem]">
              {repositories ? (
                <div className="">
                  {repositories.map((repo: { name: string }, i) => {
                    return (
                      <div
                        className="my-auto flex h-[5rem] items-center justify-between border-b border-black p-4 px-8"
                        key={i}
                      >
                        {repo.name}
                        {"  "}
                        {i + 1}
                        <button
                          className="rounded-xl border-[2px] border-green-400 bg-green-300 bg-transparent p-2 "
                          value={repo.name}
                          onClick={(e) => handleSelect(e)}
                        >
                          Select
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repos;
