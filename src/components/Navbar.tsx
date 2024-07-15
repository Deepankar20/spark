import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useState } from "react";

export const Navbar = () => {
  const { data } = useSession();
  const [dropdown, setDropdown] = useState<boolean>(false);

  return (
    <div className="flex h-[5rem] border-b border-black items-center justify-between p-8">
      <button className="flex items-center text-[2rem] font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
          viewBox="0 0 1024 1024"
          className="icon font-semibold"
          version="1.1"
        >
          <path
            d="M257.344 385.344l209.792 119.808 25.344 14.592-163.456 435.968 327.36-341.248-0.192-0.128 96.896-101.76-228.352-128 105.92-315.392z"
            fill=""
          />
          <path
            d="M547.776 499.904L335.104 378.176l201.984-171.072-66.624 198.4 210.432 117.952-93.888 98.56-139.648 145.536z"
            fill="#FDFF4F"
          />
        </svg>
        Spark
      </button>

      {data ? (
        <button className="" onClick={() => setDropdown((prev) => !prev)}>
          {
            <div className={`${dropdown ? "mt-[8rem]" : ""}`}>
              <Image
                src={data.user.image as string}
                width={"50"}
                height={"50"}
                alt=""
                className="rounded-full"
              />
              <div
                className={` flex ${
                  dropdown ? "" : "hidden"
                } w-[8rem] flex-col gap-2 rounded-lg bg-white p-2`}
              >
                <button className="rounded-lg border border-[#291334] shadow-sm hover:shadow-lg">
                  Profile
                </button>
                <button className="rounded-lg border border-[#291334] shadow-sm hover:shadow-lg">
                  Settings
                </button>
                <button
                  className="rounded-lg border border-red-500  text-red-500 hover:shadow-lg"
                  onClick={() => void signOut()}
                >
                  Logout
                </button>
              </div>
            </div>
          }
        </button>
      ) : (
        <button
          onClick={() => void signIn()}
          className="rounded-full bg-[#291334] px-4 py-2 text-[#FAF7F5] shadow-xl"
        >
          Login
        </button>
      )}
    </div>
  );
};
