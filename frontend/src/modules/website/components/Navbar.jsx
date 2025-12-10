import React, { useState } from 'react'
import { Menu, Smartphone, X } from "lucide-react";
import { Link } from 'react-router-dom';


function MobileLink({ children, to = "/", onClick = () => {} }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-sky-700 font-medium hover:bg-sky-50"
    >
      {children}
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
          {/* Mobile Sidebar Backdrop (blurred) */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
      </div>

        {/* Sidebar (mobile) */}
        <aside
            className={`md:hidden fixed top-0 left-0 z-40 h-full w-72 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-350 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
            }`}
            aria-hidden={!open}
        >
            <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-lg font-bold text-sky-600">Paikar (EPS)</h2>
            <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-sky-50"
            >
                <X className="h-5 w-5 text-sky-700" />
            </button>
            </div>

            <nav className="px-4 py-6 space-y-3">
            <MobileLink to="/" onClick={() => setOpen(false)}>Home</MobileLink>
            <MobileLink to="/features" onClick={() => setOpen(false)}>Features</MobileLink>
            <MobileLink to="/appointment" onClick={() => setOpen(false)}>Appointment</MobileLink>
            <MobileLink to="/appointment/track" onClick={() => setOpen(false)}>Track Appointment</MobileLink>
            <MobileLink to="/contact" onClick={() => setOpen(false)}>Contact</MobileLink>

            <div className="mt-6">
                <Link
                to="/appointment"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2 bg-sky-600 text-white rounded-lg shadow"
                >
                Book Appointment
                </Link>
            </div>
            </nav>
        </aside>
        <header className="flex items-center justify-between px-6 md:px-16 py-4 bg-white z-20 relative">
            <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-md hover:bg-sky-50"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6 text-sky-600" />
            </button>

            <h1 className="text-2xl font-bold text-sky-600">Paikar (EPS)</h1>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-4 lg:gap-8 text-gray-600 font-medium">
            <Link to="/" className="hover:text-sky-600">Home</Link>
            <Link to="/features" className="hover:text-sky-600">Features</Link>
            <Link to="/appointment" className="hover:text-sky-600">Appointment</Link>
            <Link to="/appointment/track" className="hover:text-sky-600">Track</Link>
            <Link to="/contact" className="hover:text-sky-600">Contact</Link>
            </nav>

            <div className="hidden md:block">
            <Link
                to="/appointment"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700"
            >
                Book Appointment
            </Link>
            </div>
        </header>

        {/* Floating PWA Install FAB */}
    <button 
      id="pwa-floating-btn"
      className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-xl hover:bg-sky-700 z-40 hidden"
    >
      <Smartphone className="h-6 w-6" />
    </button>
    </>
  )
}

export default Navbar

