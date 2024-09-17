import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";

export interface HeaderLoggedProps {}

const HeaderLogged: FC<HeaderLoggedProps> = () => {
  return (
    <div className="nc-HeaderLogged sticky top-0 w-full z-[1000] bg-[rgba(255,255,255,0.9)">
      <MainNav2Logged />
    </div>
  );
};

export default HeaderLogged;
