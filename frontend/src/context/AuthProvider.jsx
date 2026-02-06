import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchMyProfile } from '../api/me';
import { toast } from 'react-toastify';
import { offlineDB } from '../utils/offlineDB';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // ✅ Network state tracking
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const login = async (userData) => {
    setUser(userData);
    try {
      await offlineDB.setItem("auth_user", userData);
    } catch (e) {
      console.error("Failed to cache user", e);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    try {
      await offlineDB.removeItem("auth_user");
    } catch (e) {
      console.error("Failed to clear cache", e);
    }
  };

  // ✅ Bootstrap auth: offline-first strategy
  useEffect(() => {
    let alive = true;

    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (alive) setLoading(false);
        return;
      }

      // 🔴 If offline → never call API
      if (!navigator.onLine) {
        const cachedUser = await offlineDB.getItem("auth_user");

        if (cachedUser && alive) {
          setUser(cachedUser);
          toast.info("Offline mode: using cached profile");
        } else {
          toast.error("Offline and no cached session found. Connect to internet.");
          localStorage.removeItem("token");
          if (alive) setUser(null);
        }

        if (alive) setLoading(false);
        return;
      }

      // 🟢 Online → try API
      try {
        const userData = await fetchMyProfile();
        if (!alive) return;

        setUser(userData);
        await offlineDB.setItem("auth_user", userData);
      } catch (err) {
        // API failed while online (server down / 500)
        try {
          const cachedUser = await offlineDB.getItem("auth_user");

          if (cachedUser && alive) {
            setUser(cachedUser);
            toast.warn("Server unavailable. Running EPS in offline mode.");
            setIsOffline(true); // 👈 force offline mode
          } else {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            if (alive) setUser(null);
          }
        } catch (e) {
          localStorage.removeItem("token");
          if (alive) setUser(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUser();
    return () => { alive = false; };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, isOffline }}>
      {children}

      {/* ✅ Offline Banner */}
      {isOffline && user && (
        <div
            style={{
              position: "fixed",
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)', // Add this line
              borderRadius: '0 0 6px 6px',   // Optional: changed to bottom corners for a top-bar look
              fontWeight: 600,
              backgroundColor: "#facc15",
              color: "#1f2937",
              padding: "6px 10px",
              zIndex: 1000,
            }}
        >
          Offline
        </div>
      )}
    </AuthContext.Provider>
  );
};


// import React, { useEffect, useState } from 'react';
// import { AuthContext } from './AuthContext';
// import { fetchMyProfile } from '../api/me';
// import { toast } from 'react-toastify';
// import { offlineDB } from '../utils/offlineDB';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // to handle loading state

//   const login = async (userData) => {
//     setUser(userData)
//     await offlineDB.setItem("auth_user", userData)
//   };
//   const logout = async() => {
//     localStorage.removeItem('token');
//     setUser(null);
//     await offlineDB.removeItem("auth_user")
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const userData = await fetchMyProfile();
//           setUser(userData);
//           await offlineDB.setItem("auth_user", userData);
//         } catch (err) {
//           const cachedUser = await offlineDB.getItem("auth_user");
//           if (cachedUser) {
//             setUser(cachedUser);
//             toast.info("Offline mode: EPS running with cached profile");
//           } else {
//             toast.error("Please login online to continue.");
//             console.log(err)
//             localStorage.removeItem("token");
//             setUser(null);
//           }
//           // toast.error(err?.response?.data?.message)
//           // logout();
//         }
//       }
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Or a spinner while loading user data
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
