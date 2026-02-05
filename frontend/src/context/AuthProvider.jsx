import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchMyProfile } from '../api/me';
import { toast } from 'react-toastify';
import { offlineDB } from '../utils/offlineDB';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track network changes
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
      // console.log(userData)
      // if (userData?.photo) {
      //   await cacheProfileImage(userData.photo);
      // }
    } catch (e) {
      console.error("Failed to cache user", e);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    try {
      await offlineDB.removeItem("auth_user");
    } catch (e) {
      console.error("Failed to clear cache", e);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Try API first
        const userData = await fetchMyProfile();
        if (isMounted) setUser(userData);

        // Cache for offline usage
        await offlineDB.setItem("auth_user", userData);
        // if (userData?.photo) {
        //   await cacheProfileImage(userData.photo);
        // }
      } catch (err) {
        // Fallback to cached user if API fails
        try {
          const cachedUser = await offlineDB.getItem("auth_user");

          if (cachedUser && isMounted) {
            setUser(cachedUser);
            toast.info("Offline mode: EPS running with cached profile");
          } else {
            toast.error("Session expired. Please connect to internet and login again.");
            localStorage.removeItem("token");
            if (isMounted) setUser(null);
          }
        } catch (cacheErr) {
          console.error("Failed to read cache", cacheErr);
          localStorage.removeItem("token");
          if (isMounted) setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUser();

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isOffline }}>
      {children}
      {/* Offline Banner */}
      {isOffline && user && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          // width: '100%',
          borderBottomRightRadius: "10px",
          fontWeight: 600,
          backgroundColor: '#facc15',
          color: '#1f2937',
          padding: '4px',
          textAlign: 'center',
          zIndex: 1000,
        }}>
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
