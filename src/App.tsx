import React from "react";
import MyRouter from "routers/index";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "context/AuthContext";
import { store } from "store";
import { Provider } from "react-redux";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Tennis Brain || Tennis Brain</title>
        <meta
          name="description"
          content="Tennis Brain || Tennis Brain"
        />
      </Helmet>

      {/* MAIN APP */}
      <div className="bg-white text-base dark:bg-slate-900 text-slate-900 dark:text-slate-200">
        <Provider store={store}>
          <AuthProvider>
            <MyRouter />
          </AuthProvider>
        </Provider>
      </div>
    </HelmetProvider>
  );
}

export default App;
