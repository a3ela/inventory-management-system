import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdHome,
  MdPeople,
  MdInventory2,
  MdPerson,
  MdLogin,
  MdReceiptLong,
} from "react-icons/md";

import "./Sidebar.scss";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: MdHome },
  { path: "/transactions", label: "Transactions", icon: MdReceiptLong },
  { path: "/products", label: "Products", icon: MdInventory2 },
  { path: "/users", label: "Users", icon: MdPeople },
  { path: "/profile", label: "Profile", icon: MdPerson },
  { path: "/login", label: "Login", icon: MdLogin },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__header">
        {!collapsed && <h1 className="sidebar__title">Inventory</h1>}

        <button
          className="sidebar__close-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <MdOutlineKeyboardDoubleArrowRight />
          ) : (
            <MdOutlineKeyboardDoubleArrowLeft />
          )}
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={item.label === "Profile" ? "sidebar__bottom" : ""}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__nav-link ${isActive ? "active" : ""}`
                }
              >
                <item.icon className="sidebar__icon" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
