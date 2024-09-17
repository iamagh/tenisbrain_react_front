import React, { FC } from "react";
import MainNav from "./MainNav";

export interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="nc-Header sticky top-0 w-full z-[1000] bg-[rgba(255,255,255,0.9)]">
      <MainNav isTop={ true }/>
    </div>
  );
};

export default Header;
