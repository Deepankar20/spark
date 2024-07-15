export const Navbar = () => {
  return (
    <div className="flex h-[5rem] items-center justify-between p-8">
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
      <div className="flex gap-8 text-[1.2rem]">
        <button className="hover:text-[#291334] hover:underline">
          Pricing
        </button>
        <button className="hover:text-[#291334] hover:underline">FAQ</button>
        <button className="hover:text-[#291334] hover:underline">
          Support
        </button>
      </div>
      <button className="rounded-full bg-[#291334] px-4 py-2 text-[#FAF7F5] shadow-xl">
        Login
      </button>
    </div>
  );
};
