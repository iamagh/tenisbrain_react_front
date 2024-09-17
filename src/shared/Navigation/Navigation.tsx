import React from "react";
import NavigationItem from "./NavigationItem";
import HashNavigationItem from "./HashNavigationItem";
import { HOME_NAV_MENUS } from "data/navigation";
import ncNanoId from "utils/ncNanoId";

function Navigation() {
  const user: any = localStorage.getItem('user');

  return (
    <ul className="nc-Navigation hidden lg:flex items-center">
      {/* {NAVIGATION.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))} */}
      {  
        HOME_NAV_MENUS.map((item: any, index: number) => <HashNavigationItem key={index} href={item.href} name={item.name} />)
      }
      <NavigationItem key={HOME_NAV_MENUS.length} menuItem={user && user > 0 ? {
          id: ncNanoId(),
          href: "/calendar",
          name: "Platform",
        } : {
          id: ncNanoId(),
          href: "/login",
          name: "Login",
        }
      } />
    </ul>
  );
}

export default Navigation;
