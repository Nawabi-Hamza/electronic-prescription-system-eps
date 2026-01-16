import React from "react";
import SectionContainer from "../../../componenets/SectionContainer";
import { useAuth } from "../../../hooks/useAuth";
import { badge, btnStyle, gridStyle } from "../../../styles/componentsStyle";
import ImageViewer from "../../../componenets/ImageViewer";
import { Link } from "react-router-dom";
import { Accessibility, HandCoins, NotepadTextDashed, Pill, UserCog } from "lucide-react";
import PaymentBanner from "./PaymentBanner";


const cardStyle = {
  container: "rounded-md bg-gradient-to-br p-6 shadow  hover:shadow-lg transition transform  duration-200  space-y-4  mb-2",
  content: "flex flex-wrap justify-center sm:justify-start md:gap-5 items-center text-xl"
};

const DoctorDashboard = ({ payments }) => {
    const { user } = useAuth()
  
  return (
    <>
      <SectionContainer title="👋🏻 Welcome Doctor">
            {/* <PaymentBanner payments={payments} /> */}

            {user && (
                <div className={`${cardStyle.container} from-sky-500/20 to-sky-500/10`}>
                  <div className="md:flex relative md:space-y-0 justify-between items-center mb-2">
                    <span className="flex gap-5 items-center text-xl text-gray-800">
                      <ImageViewer 
                        imagePath={`/uploads/profiles/${user.photo}`}
                        className="rounded h-20 w-auto"
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
      {user && (
        <div className={gridStyle.item2atRow}>
          <SectionContainer title="Prescription">
              <Link to="/doctor/prescription">
                <div className={`${cardStyle.container} from-lime-500/10 to-lime-500/5`}>
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
                      <p className="mt-2 hidden sm:block text-2xl font-bold text-amber-900">Medicince Lists</p>
                    </div>
                  </span>
                </div>
              </Link>
          </SectionContainer>
          <SectionContainer title="Payments">
              <Link to={"/doctor/payments"}>
                <div className={`${cardStyle.container} from-pink-500/10 to-pink-500/5`}>
                  <div className={cardStyle.content}>
                    <HandCoins className={`h-10 w-10 sm:h-20 sm:w-20 text-pink-500`}/>
                    <div>
                      <p className="mt-2 hidden sm:block text-2xl font-bold text-pink-900">Your Payments</p>
                    </div>
                  </div>
                </div>
              </Link>
          </SectionContainer>
        </div>
      )}
    </>
  );
};

export default DoctorDashboard;

