import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.scss";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
