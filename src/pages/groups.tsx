/* eslint-disable*/
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import GroupComponent from "../components/Group/groupComponent";
import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { leftSideBarSelect } from "../atoms/leftSIdeBarSelect";

export default function Groups() {
  const [dialog, setDialog] = useState(false);
  const [selected, setSelected] = useRecoilState(leftSideBarSelect);
  const session = useSession();

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  interface IGroupsProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    group_name: string;
    description: string | null;
    group_picture: string | null;
    createdBy: string;
  }

  const [groups, setGroups] = useState<IGroupsProps[]>([]);

  const [loading, setLoading] = useState(false);

  const create = api.group.create.useMutation({
    onSuccess: (data) => {
      if (data.code) {
        console.log("message : ", data.message);
        console.log(data.data);
      }
    },
  });

  const getAllGroups = api.group.getAllGroups.useMutation({
    onSuccess: (data) => {
      if (data.code === 201 && data.data) {
        setGroups(data.data);
      }
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    create.mutate({
      group_name: formData.name,
      description: formData.description,
      group_picture: "",
    });

    setLoading(false);
    setDialog(false);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setSelected("Groups");
    session.data &&
      getAllGroups.mutate({
        userId: session.data.user.id,
      });
  }, []);

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>
          <h1 className="mt-[5px] text-4xl">Groups</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDialog((prev) => !prev)}
              className="mt-5 rounded-xl bg-[#291334] p-2 text-[#FAF7F5]"
            >
              Create Group
            </button>

            <button
              onClick={() => {
                session.data &&
                  getAllGroups.mutate({
                    userId: session.data.user.id,
                  });
              }}
              className="text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
              </svg>
            </button>
          </div>

          {dialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="mx-auto mt-[10rem] w-[50rem]  px-6 shadow-xl sm:px-6 lg:px-8">
                <div className="-mt-72 w-full rounded bg-[#291334] p-8 shadow sm:p-12">
                  <p className="text-center text-3xl font-bold leading-7 text-[#FAF7F5]">
                    Create New Group
                  </p>
                  <button
                    onClick={() => setDialog(false)}
                    className="-translate-x-8 -translate-y-16 rounded-full bg-[#FAF7F5] px-2 text-center font-semibold  text-[#291334]"
                  >
                    x
                  </button>
                  <form action="" className="" onSubmit={handleSubmit}>
                    <div className="mt-12 items-center md:flex">
                      <div className="flex w-full flex-col md:w-1/2">
                        <label className="font-semibold leading-none text-[#FAF7F5]">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="mt-4 rounded border-0 bg-[#FAF7F5] p-3 leading-none text-[#291334] focus:border-blue-700 focus:outline-none"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mt-8 flex w-full flex-col">
                        <label className="font-semibold leading-none text-gray-300">
                          Description
                        </label>
                        <textarea
                          onChange={handleChange}
                          name="description"
                          className="mt-4 h-40 rounded border-0 bg-[#FAF7F5] p-3 text-base leading-none text-[#291334] focus:border-blue-700 focus:outline-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-center">
                      <button
                        className="mt-9 rounded border bg-[#FAF7F5] px-10 py-4 font-semibold leading-none text-[#291334] hover:border-[#FAF7F5] 
                      hover:bg-[#291334] hover:text-[#FAF7F5] focus:outline-none  "
                      >
                        {loading ? "Creating" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          <div className="mt-[2rem] flex flex-col gap-8">
            <div className="grid grid-cols-4 gap-4">
              {groups.map((group) => {
                return (
                  <div
                    key={group.id}
                    className="flex flex-col rounded-xl border border-[#291334] p-8 hover:cursor-pointer hover:bg-[#291334] hover:text-[#FAF7F5]"
                    onClick={() => {
                      router.push(`/group?g=${group.id}`);
                    }}
                  >
                    <h1 className="text-xl font-semibold">
                      {group.group_name}
                    </h1>
                    <p className="">
                      {group.description &&
                        (group.description.length < 10
                          ? group.description
                          : group.description.slice(0, 10) + "...")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
