import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import Toaster from './componenets/Toaster';
import 'animate.css';
import { HelmetProvider, Helmet } from 'react-helmet-async';

const MODE = import.meta.env.VITE_PRODUCTION_MODE;

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        {/* Global SEO Meta Tags */}
        <Helmet>
          <title>Paikar EPS – Electronic Prescription System</title>
          <meta
            name="description"
            content="Paikar EPS is an advanced electronic prescription system for doctors and clinics. Fast, reliable, and easy to use."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="canonical" href="https://paikareps.com" />

          {/* Open Graph */}
          <meta property="og:title" content="Paikar EPS – Electronic Prescription System" />
          <meta
            property="og:description"
            content="Paikar EPS is an advanced electronic prescription system for doctors and clinics. Fast, reliable, and easy to use."
          />
          <meta property="og:image" content="/pwa-512x512.png" />
          <meta property="og:url" content="https://paikareps.com" />
          <meta property="og:type" content="website" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Paikar EPS – Electronic Prescription System" />
          <meta
            name="twitter:description"
            content="Paikar EPS is an advanced electronic prescription system for doctors and clinics. Fast, reliable, and easy to use."
          />
          <meta name="twitter:image" content="/pwa-512x512.png" />
        </Helmet>
          <Toaster />
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;









// import { AuthProvider } from './context/AuthProvider';
// import AppRoutes from './routes/AppRoutes';
// import Toaster from './componenets/Toaster';
// import 'animate.css';
// const MODE = import.meta.env.VITE_PRODUCTION_MODE;

// const App = () => {
//   // Prevent to inspect to website
//   // if(MODE){
//   //   document.addEventListener('contextmenu', (e) => e.preventDefault());
//   //   document.onkeydown = (e) => {
//   //         if (
//   //             event.keyCode === 123 || // F12
//   //             (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) || // Ctrl+Shift+I
//   //             (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) // Ctrl+Shift+J
//   //         ) {
//   //             return false;
//   //         }
//   //   };
//   // }
//   return (
//     <AuthProvider>
//       <Toaster />
//       <AppRoutes />
//     </AuthProvider>
//   );
// };

// export default App;
