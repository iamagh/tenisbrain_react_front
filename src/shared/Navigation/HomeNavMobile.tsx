import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useAuth } from "context/AuthContext";

import ncNanoId from "utils/ncNanoId";

import { NavItemType } from "./NavigationItem";
import { HOME_NAV_MENUS } from "data/navigation";

import ButtonClose from "shared/ButtonClose/ButtonClose";
import Logo from "shared/Logo/Logo";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SocialsList from "shared/SocialsList/SocialsList";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const HomeNavMobile: React.FC<NavMobileProps> = ({
  data = HOME_NAV_MENUS,
  onClickClose,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(0);
  useEffect(() => {
    const userId = localStorage.getItem('user');
    setUser(userId);
  }, []);

  const _hashNavigationItem = (item: any, index: number) => {
    return (
      <li
        className={`menu-item flex-shrink-0 menu-megamenu menu-megamenu--large`}
        key={index}
      >
        <div className="flex-shrink-0 flex items-center">
          <a
            className="flex items-center py-2 px-4 w-full rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 "
            href={item.href}
          >
            {item.name}
          </a>
        </div>
      </li>
    )
  }

  const _renderNavigationItem = (item: any) => {
    return (
      <NavLink
        target={item.targetBlank ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={({ isActive }) =>
          `flex items-center py-2 px-4 w-full rounded-md hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 ${
            isActive
              ? "font-medium text-neutral-900 dark:text-neutral-100"
              : "font-normal text-neutral-6000 dark:text-neutral-400 "
          }`
        }
        to={{
          pathname: item.href || undefined,
        }}
      >
        {item.name}
      </NavLink>
    )
  }

  const _renderMenuChild = (
    item: NavItemType,
    itemClass = " pl-3 text-neutral-900 dark:text-neutral-200 font-medium "
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <NavLink
              to={{
                pathname: i.href || undefined,
              }}
              className={({ isActive }) =>
                `flex text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5 pr-4 ${itemClass} ${isActive ? "text-secondary" : ""
                }`
              }
            >
              <span
                className={`py-2.5 ${!i.children ? "block w-full" : ""}`}
                onClick={onClickClose}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex items-center flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-slate-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>
                {_renderMenuChild(
                  i,
                  "pl-3 text-slate-600 dark:text-slate-400 "
                )}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const handleLogOut = () => logout();

  return (
    <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5">
        <Logo />
        <div className="flex flex-col mt-5 text-slate-600 dark:text-slate-300 text-sm">
          <div className="flex justify-between items-center mt-4">
            <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        { data.map(_hashNavigationItem) }
        { _renderNavigationItem(user && user > 0 ? {
          id: ncNanoId(),
          href: "/calendar",
          name: "Bookings",
        } : {
          id: ncNanoId(),
          href: "/login",
          name: "Login",
        }) }
      </ul>
      {
        user > 0 && <div className="flex items-center justify-between py-6 px-5 space-x-2">
          <ButtonPrimary onClick={handleLogOut} className="!px-10">
            Log Out
          </ButtonPrimary>
        </div>
      }
    </div>
  );
};

export default HomeNavMobile;
