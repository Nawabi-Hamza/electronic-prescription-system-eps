import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Topbar from '../componenets/Topbar';
import { mainSectionStyles } from '../styles/dashboardStyles';
import Footer from './Footer';
import SectionContainer from '../componenets/SectionContainer';
import { toast } from 'react-toastify';
import { playSound } from '../utils/soundPlayer';
import { useAuth } from '../hooks/useAuth';
import { btnStyle } from '../styles/componentsStyle';
import { LogOut } from 'lucide-react';
import MobileBottomNav from '../modules/doctor/components/MobileBottomNav';
const DoctorLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="flex h-screen bg-gray-100 animate__backInDown animate__animated animate__delay-.5s">
      {/* flex-col, flex-grow, and full height */}
      <div className="flex w-full overflow-auto flex-col flex-grow h-full">
        <Topbar>
          <button
            className={btnStyle.danger}
            onClick={() => {
              logout()
              toast("🙋🏻‍♂️ Logout Successfuly",{
                autoClose: 5000,
                onOpen: playSound("default")
              })
              navigate("/auth/login")
            }}
          >
            <LogOut size={16} className="inline-block text-white" />
          </button>
        </Topbar>
        {/* main fills remaining height, scrolls internally */}
        <main className={mainSectionStyles.container+" max-w-7xl mx-auto mb-16 md:mb-0"}>
          <Outlet />
          <Footer />
        </main>
        {/* Mobile-only bottom navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};


export default DoctorLayout;
