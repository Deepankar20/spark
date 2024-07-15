import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";
import { RecoilRoot } from "recoil";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <div className="min-h-screen bg-[#FAF7F5] text-[#291334]">
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
