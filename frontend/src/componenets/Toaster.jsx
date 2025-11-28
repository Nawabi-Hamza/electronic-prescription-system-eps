import { Slide, ToastContainer, toast } from 'react-toastify';
// import { toast } from "react-toastify";
import { btnStyle } from "../styles/componentsStyle";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react"; 
import { playSound } from '../utils/soundPlayer';



export default function Toaster(){
  return (
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
          onOpen={() => playSound("success")}
    />
  );
};

export function ConfirmToast(content,onConfirm){
  toast.info(
    <div>
      {content}
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => {
            onConfirm(); // call your delete function
            toast.dismiss(); // remove the toast
          }}
          className={btnStyle.filled}
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          className={btnStyle.secondary}
        >
          No
        </button>
      </div>
    </div>,
    {
      autoClose: false, // keep toast until user clicks
      closeOnClick: false,
      draggable: false,
      onOpen: playSound("default")
    }
  );
};

export const ShowNotification = (notification) => {
  const NotificationCard = () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div
        className={`cursor-pointer mt-4 -mx-5 -mb-5 p-4 transition-all duration-300 
        ${expanded ? "bg-sky-500" : "bg-sky-400"} 
        text-white rounded-lg`}
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          🔔 {notification.title}
        </h3>
        <p className="text-sm mt-1">{notification.content}</p>

        {expanded && (
          <div className="text-xs mt-3 border-t border-white/30 pt-2">
            <p>
              Posted by{" "}
              <span className="font-semibold">
                {notification.creator_firstname} {notification.creator_lastname}
              </span>{" "}
              <span className="italic">({notification.creator_role})</span>
            </p>
            <p>{new Date(notification.created_at).toLocaleString()}</p>
          </div>
        )}

        <p className="text-[11px] mt-2 opacity-80">
          {expanded ? "Click to hide details ↑" : "Click to view details ↓"}
        </p>
      </div>
    );
  };

  toast(<NotificationCard />, {
    position: "bottom-right",
    autoClose: false, // disappears after 5s
    closeOnClick: false,
    draggable: true,
    className: "bg-transparent shadow-xl p-0 rounded-xl", // remove default white bg
    bodyClassName: "p-0", // no white padding
  });
};