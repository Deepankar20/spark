/* eslint-disable*/

import { useState } from "react";
import GroupComponent from "../components/Group/groupComponent";
import { Navbar } from "../components/Navbar";
import LeftSideBar from "../components/leftSideBar";
import { api } from "../utils/api";

export default function Groups() {
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(false);

  const create = api.group.create.useMutation({
    onSuccess: (data) => {
      if (data.code) {
        console.log("message : ", data.message);
        console.log(data.data);
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

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex gap-16">
        <LeftSideBar />
        <div>
          <h1 className="mt-[5px] text-4xl">Groups</h1>
          <button
            onClick={() => setDialog((prev) => !prev)}
            className="mt-5 rounded-xl bg-[#291334] p-2 text-[#FAF7F5]"
          >
            Create Group
          </button>

          {dialog && (
            <div className="fixed bottom-8 mt-5 h-[32rem] w-[50rem] rounded-xl">
              <div className="mx-auto mt-[10rem]   px-6 shadow-xl sm:px-6 lg:px-8">
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
            <div className="grid grid-cols-4 gap-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
