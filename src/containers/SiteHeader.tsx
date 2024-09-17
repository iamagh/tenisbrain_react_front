import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderLogged from "components/Header/HeaderLogged";
import Header from "components/Header/Header";
import { LOGGED_ROUTES } from "data/navigation";

const SiteHeader = () => {
  let location = useLocation();
  const user: any = localStorage.getItem('user');
  // console.log('location', location);
  const [isLogged, setIsLogged] = useState(false);
  const isSubMenu = () => {
    
    const pathname = location.pathname;
    const pathArray = pathname.split('/');
    // console.log('path array', pathArray);
    return LOGGED_ROUTES.find((item)=> item == pathArray[1])
  }
  // return user > 0 ? <HeaderLogged /> : <Header />;
  return isSubMenu() ? <HeaderLogged /> : <Header />;
};

export default SiteHeader;
