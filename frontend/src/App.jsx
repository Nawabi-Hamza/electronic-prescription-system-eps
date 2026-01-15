import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import Toaster from './componenets/Toaster';
import 'animate.css';
const MODE = import.meta.env.VITE_PRODUCTION_MODE;

const App = () => {
  // Prevent to inspect to website
  // if(MODE){
  //   document.addEventListener('contextmenu', (e) => e.preventDefault());
  //   document.onkeydown = (e) => {
  //         if (
  //             event.keyCode === 123 || // F12
  //             (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) || // Ctrl+Shift+I
  //             (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) // Ctrl+Shift+J
  //         ) {
  //             return false;
  //         }
  //   };
  // }
  return (
    <AuthProvider>
      <Toaster />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
