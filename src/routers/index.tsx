import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "context/AuthContext";
import PrivateRoute from "./PrivateRoute";

import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AccountPage from "containers/AccountPage/AccountPage";
import PageSettings from "containers/PageSetting/PageSetting";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import SiteHeader from "containers/SiteHeader";
import PageSearch from "containers/PageSearch";
import AccountPass from "containers/AccountPage/AccountPass";
import PageCalenda from "containers/PageCalenda/PageCalenda";
import PageDashboard from "containers/PageDashboard/PageDashboard";
import PageAvailability from "containers/PageAvailability/PageAvailability";
import PageExercise from "containers/PageExercise/PageExercise";
import PagePlayerCoaches from "containers/PlayerPages/Coaches";
// import PageMembers from "containers/PageMembers/PageMembers";
import PageMembers from "containers/PlayerPages/Players";
import PagePlayerDashboard from "containers/PlayerPages/Dashboard";
import PagePlayerCalenda from "containers/PlayerPages/Calendar";

export const pages: Page[] = [
  // { path: "/", component: PageHome },
  //
  { path: "/page-search", component: PageSearch },
  //
  { path: "/account", component: AccountPage },
  { path: "/account-change-password", component: AccountPass },
  //
  //
  { path: "/settings", component: PageSettings },

  //
  // { path: "/signup", component: PageSignUp },
  // { path: "/login", component: PageLogin },
  { path: "/calendar", component: PageCalenda },
  { path: "/dashboard", component: PageDashboard },
  { path: "/availability", component: PageAvailability },
  { path: "/exercises", component: PageExercise },
  { path: "/members", component: PageMembers },
  { path: "/player-coaches", component: PagePlayerCoaches },
  { path: "/player-dashboard", component: PagePlayerDashboard },
  { path: "/player-calendar", component: PagePlayerCalenda },
];

const MyRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* react-hot-toast */}
        <Toaster />
        {/* react-toastify notification */}
        <ToastContainer />
        <ScrollToTop />
        <SiteHeader />
        <Routes>
          <Route index element={<PageHome />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/signup" element={<PageSignUp />} />
          <Route element={<PrivateRoute />}>
            {pages.map(({ component: Component, path }, index) => {
              return <Route key={index} element={<Component />} path={path} />;
            })}
          </Route>
          <Route element={<Page404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default MyRoutes;
