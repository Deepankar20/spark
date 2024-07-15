export const Hero = () => {
  return (
    <div className="mx-[2rem] mt-[9rem] px-28 text-center ">
      <div className="text-[3.5rem] font-semibold ">
        Unleash your coding potential with Spark {" : "}
        <div className="inline-block bg-[#291334] p-2 text-[#FAF7F5]">
          Track,
        </div>
        {"  "}
        <div className="inline-block bg-[#291334] p-2 text-[#FAF7F5]">
          Compete
        </div>{" "}
        and{" "}
        <div className="inline-block bg-[#291334] p-2 text-[#FAF7F5]">
          {" "}
          Code
        </div>
        .
      </div>

      <p className="mx-[10rem] my-[2rem] text-[1.5rem]">
        Supercharge your development journey with Spark Track your productivity,
        compete with peers, and reach new heights in coding excellence.
      </p>

      <button className="mt-[1rem] rounded-full bg-[#291334] px-4 py-2 text-[#FAF7F5] hover:px-6 hover:font-semibold hover:shadow-lg">
        Get Started Now!
      </button>

      <div className="m-[2rem] mt-[4rem] flex flex-col items-center space-y-2">
        <p className="flex items-center gap-2 italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="green"
            className="h-[18px] w-[18px] text-accent"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Collaborate and compete with peers.
        </p>
        <p className="flex items-center gap-2 italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="green"
            className="h-[18px] w-[18px] text-accent"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Showcase your coding achievements.
        </p>
        <p className="flex items-center gap-2 italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="green"
            className="h-[18px] w-[18px] text-accent"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            ></path>
          </svg>
          See how you rank among developers.
        </p>
      </div>
    </div>
  );
};
