
import React, { useEffect, useState } from "react";
import SectionContainer from "../../../componenets/SectionContainer";
import { useAuth } from "../../../hooks/useAuth";
import { badge, btnStyle, gridStyle } from "../../../styles/componentsStyle";
import ImageViewer from "../../../componenets/ImageViewer";
import { Link } from "react-router-dom";
import { Accessibility, CalendarCheck2, ClipboardList, HandCoins, NotepadTextDashed, Pill, Settings, UserCog } from "lucide-react";
import { getCurrentBillNumber, offlineDB } from "../../../utils/offlineDB";





const DoctorDashboard = () => {
  const { user, isOffline } = useAuth()  
  const [tp, setTp] = useState(0)
  const cardStyle = {
    container: "rounded-md bg-gradient-to-br p-4 md:p-6 shadow  hover:shadow-lg transition transform  duration-200  space-y-4  mb-2",
    content: "flex flex-wrap justify-center sm:justify-start md:gap-5 items-center text-xl"
  };
  useEffect(()=>{
    getCurrentBillNumber({ seter: setTp })
  }, [])

  const demoStats = {
    totalPrescriptions: tp,   // demo number
    totalAppointments: 42,     // demo number
  };
  return (
    <>
    <div className="lg:grid grid-cols-2 gap-4 items-start ">
      <div className="lg:mt-4">
        <SectionContainer title="👋🏻 Welcome Doctor">
              {/* <PaymentBanner payments={payments} /> */}
              {isOffline && <p className="bg-amber-100 rounded-md p-2">⚠️ Your Are Using Paikar-EPS Offline</p>}

              {user && (
                  <div className={`${cardStyle.container} from-sky-500/20 to-sky-500/10`}>
                    <div className="md:flex relative md:space-y-0 justify-between items-center mb-2">
                      <span className="flex gap-5 items-center text-xl text-gray-800">
                          <ImageViewer
                            imagePath={`/uploads/profiles/${user.photo}`}
                            className="rounded h-20 w-20 object-cover"
                          />
                        <div className="uppercase"> 
                          <strong>{user.full_name}</strong>
                          <p className="text-sm">{user.clinic_name}</p>
                        </div>
                      </span>
                          <Link to="/doctor/profile" className={btnStyle.filledSm+" absolute -top-4 -right-4 flex items-center gap-1"}>
                            <UserCog size={16} /> <span className="hidden sm:block">Setting</span>
                          </Link>
                    </div>
                  </div>
              )}
        </SectionContainer>
        <div className={"grid gap-2 mt-2 grid-cols-2 -mb-4"}>
              <div className={`${cardStyle.container} hover:shadow-none block from-cyan-500/10 to-cyan-500/5`}>
                <div className={'flex gap-2 items-center'}>
                  <ClipboardList className="h-10 w-10 sm:h-20 sm:w-20 text-cyan-500" />

                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-cyan-900">
                      {demoStats.totalPrescriptions}
                    </p>
                    <p className="md:mt-1 text-sm font-medium text-cyan-700">
                      Prescriptions
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${cardStyle.container} hover:shadow-none from-teal-500/10 to-teal-500/5`}>
                <div className={'flex gap-2 items-center'}>
                  <CalendarCheck2 className="h-10 w-12 sm:h-20 sm:w-20 text-teal-500" />

                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-teal-900">
                      {demoStats.totalAppointments}
                    </p>
                    <p className="md:mt-1 text-sm font-medium text-teal-700">
                      Appointments
                    </p>
                  </div>
                </div>
              </div>
        </div>
      </div>
      {user && (
        <div className={gridStyle.item2atRow}>
          <SectionContainer title="Prescription">
              <Link to="/doctor/prescription" >
                <div className={`${cardStyle.container} block from-lime-500/10 to-lime-500/5`}>
                  <div className={cardStyle.content}>
                    <NotepadTextDashed className="h-10 w-10 sm:h-20 sm:w-20 text-lime-500" />
                    <div>
                      <p className="mt-2 sm:block hidden text-2xl font-bold text-lime-900">Prescriptions</p>
                    </div>
                  </div>
                </div>
              </Link>
          </SectionContainer>
          <SectionContainer title="Appoinment">
              <Link to="/doctor/appoinment">
                <div className={`${cardStyle.container} from-indigo-500/10 to-indigo-500/5`}>
                  <div className={cardStyle.content}>
                    <Accessibility className="h-10 w-12 sm:h-20 sm:w-20 text-indigo-500"/>
                    <div>
                      <p className="mt-2 hidden sm:block text-2xl font-bold text-indigo-900">Appoinments</p>
                    </div>
                  </div>
                </div>
              </Link>
          </SectionContainer>
          <SectionContainer title="Midecine">
              <Link to="/doctor/medicine">
                <div className={`${cardStyle.container} from-amber-500/10 to-amber-500/5`}>
                  <span className={cardStyle.content}>
                    <Pill className="h-10 w-10 sm:h-20 sm:w-20 text-amber-500" />
                    <div>
                      <p className="mt-2 hidden sm:block text-2xl font-bold text-amber-900">Medicine</p>
                    </div>
                  </span>
                </div>
              </Link>
          </SectionContainer>
          <SectionContainer title="Setting">
              <Link to={"/doctor/prescription/settings"}>
                <div className={`${cardStyle.container} from-pink-500/10 to-pink-500/5`}>
                  <div className={cardStyle.content}>
                    <Settings className={`h-10 w-10 sm:h-20 sm:w-20 text-pink-500`}/>
                    <div>
                      <p className="mt-2 hidden sm:block text-2xl font-bold text-pink-900">Setting</p>
                    </div>
                  </div>
                </div>
              </Link>
          </SectionContainer>
        </div>
      )}
    </div>
    </>
  );
};

export default DoctorDashboard;

