import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Menu, LogOut,  ChevronDown, ChevronRight,} from "lucide-react";
import { sidebarStyles } from "../styles/dashboardStyles";
import "./SidebarStyles.css"
import { playSound } from "../utils/soundPlayer";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";


export default function Sidebar({ sidebarTitle, sidebarItems, iconSize = 24 }) {
  const { logout } = useContext(AuthContext)
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({});
  const location = useLocation();
  const navigate = useNavigate()

  const isMobile = window.innerWidth < 768; // true if screen < md

  const processedItems = sidebarItems.flatMap(item => {
    if (isMobile && item.type === "dropdown") {
      // flatten dropdown into individual links
      return item.children.map(child => ({
        ...child,
        type: "link",
      }));
    }
    return [item];
  });

  useEffect(() => {
    function handleResize() {
      setCollapsed(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // auto-open dropdowns if active path is inside
  useEffect(() => {
    const newOpen = {};
    processedItems.forEach((item) => {
      if (
        item.type === "dropdown" &&
        item.children.some((child) => location.pathname.startsWith(child.path))
      ) {
        newOpen[item.label] = true;
      }
    });
    setOpenDropdown(newOpen);
  }, [location.pathname]);

  return (
    <aside className={sidebarStyles.wrapper(collapsed)}>
      <div className={sidebarStyles.header}>
          {!collapsed && <div className="font-bold text-nowrap">{sidebarTitle}</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 hover:bg-gray-50 cursor-pointer rounded ${collapsed && 'mx-auto'}`}
          aria-label="Toggle sidebar"
        >
          <Menu size={iconSize} />
        </button>
      </div>

      <nav className={sidebarStyles.nav} id="container-of-svg">
        {processedItems.map((item) => {
          if (item.type === "link") {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  sidebarStyles.link(collapsed, isActive)
                }
              >
                <Icon size={iconSize} className="inline-block" />
                {!collapsed && (
                  <span className={sidebarStyles.linkText}>{item.label}</span>
                )}
              </NavLink>
            );
          }

          if (item.type === "dropdown") {
            const Icon = item.icon;
            const isOpen = openDropdown[item.label] || false;

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    setOpenDropdown((prev) => ({
                      ...prev,
                      [item.label]: !isOpen,
                    }))
                  }
                  className={`${sidebarStyles.link(collapsed)} w-full flex items-center justify-between`}
                >
                  <div className="flex items-center" >
                    <Icon size={iconSize} className="inline-block" />
                    {!collapsed && (
                      <span className={sidebarStyles.linkText}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!collapsed &&
                    (isOpen ? (
                      <ChevronDown size={iconSize-4} />
                    ) : (
                      <ChevronRight size={iconSize-4} />
                    ))}
                </button>

                {isOpen && !collapsed && (
                  <div className="ml-4 flex flex-col">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            sidebarStyles.link(collapsed, isActive)
                          }
                        >
                          <ChildIcon size={iconSize-4} /> {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}

        {/* Logout (special case, not part of config) */}
        <button
          className={sidebarStyles.logout(collapsed)}
          onClick={() => {
            logout()
            toast("🙋🏻‍♂️ Logout Successfuly",{
              autoClose: 5000,
              onOpen: playSound("default")
            })
            navigate("/auth/login")
          }}
        >
          <LogOut size={iconSize} className="inline-block" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </nav>
      
    </aside>
  );
}
