import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { leftSideBarSelect } from "../atoms/leftSIdeBarSelect";

export default function LeftSideBar() {
  const [selected, setSelected] = useRecoilState(leftSideBarSelect);

  const router = useRouter();

  return (
    <div className="flex min-h-screen min-w-[14rem]  flex-col gap-6  rounded-2xl p-1 shadow-xl">
      <button
        className={`mt-[2rem] ${
          selected == "Dashboard" ? "bg-[#291334] text-[#FAF7F5]" : ""
        } rounded-xl p-1`}
        onClick={() => {
          setSelected("Dashboard");
          void router.push("/dashboard");
        }}
      >
        Dashboard
      </button>
      <button
        className={`${
          selected == "Repos" ? "bg-[#291334] text-[#FAF7F5]" : ""
        } rounded-xl p-1`}
        onClick={() => {
          setSelected("Repos");
          void router.push("/repos");
        }}
      >
        Repos
      </button>
      <button
        className={`${
          selected == "Groups" ? "bg-[#291334] text-[#FAF7F5]" : ""
        } rounded-xl p-1`}
        onClick={() => {
          setSelected("Groups");
          void router.push("/groups");
        }}
      >
        Groups
      </button>
    </div>
  );
}
