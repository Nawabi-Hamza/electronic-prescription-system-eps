import { topbarStyles } from "../styles/dashboardStyles";
import { useAuth } from "../hooks/useAuth";
import { appConfig } from "../utils/appConfig.js";
import { HeartPlus } from "lucide-react";


export default function Topbar({ children }) {
  const { user } = useAuth();

  return (
    <header className={topbarStyles.wrapper+" print:hidden"} id='container-of-svg'>
      <div>
        <h1 className={topbarStyles.title}>
          {/* <img src={appConfig.logo} className="w-auto h-8" alt="" /> */}
          <HeartPlus />
          {appConfig.name}
        </h1>
        <span className={topbarStyles.welcome}>
          👋🏻 {user?.full_name ? user.full_name:"Take care of your health"}
        </span>
      </div>
      {children}
    </header>
  );
}
