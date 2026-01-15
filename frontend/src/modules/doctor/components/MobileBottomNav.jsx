import { NavLink } from "react-router-dom";
import { Home, User, ClipboardList, Settings, Pill, NotepadTextDashed } from "lucide-react";

const navItem = "flex flex-col px-4 py-1 rounded-2xl items-center justify-center gap-1 text-xs font-medium transition";

// const activeNav = "text-sky-600 ";

const activeNav =
  "text-sky-600 bg-sky-50 shadow-md transform -translate-y-6 transition-all duration-300 ease-out";


export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg md:hidden">
      <div className="flex justify-around h-16 pb-safe">
        <NavLink to="/doctor/prescription"
            className={({ isActive }) =>
                `${navItem} ${
                isActive ? activeNav : "text-gray-400"
                }`
            }
        >
          <NotepadTextDashed size={22} />
          Prescription
        </NavLink>

        <NavLink
          to="/doctor/appoinment"
          className={({ isActive }) =>
            `${navItem} ${
              isActive ? activeNav : "text-gray-400"
            }`
          }
        >
          <ClipboardList size={22} />
          Patients
        </NavLink>

        <NavLink to="/doctor/dashboard"
          className={({ isActive }) =>
            `${navItem} ${
              isActive ? activeNav : "text-gray-400"
            }`
          }
        >
          <Home size={22} />
          Home
        </NavLink>
        
        <NavLink
          to="/doctor/profile"
          className={({ isActive }) =>
            `${navItem} ${
              isActive ? activeNav : "text-gray-400"
            }`
          }
        >
          <User size={22} />
          Profile
        </NavLink>

        <NavLink
          to="/doctor/medicine"
          className={({ isActive }) =>
            `${navItem} ${
              isActive ? activeNav : "text-gray-400"
            }`
          }
        >
          <Pill size={22} />
          Medicine
        </NavLink>
      </div>
    </nav>
  );
}
