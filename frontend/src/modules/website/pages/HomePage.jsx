import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Calendar,
  ShieldCheck,
  FileText,
  Smartphone,
  CheckCircle2,
  Star,
} from "lucide-react";

function HomePage() {
  const [open, setOpen] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    });
  };




  return (
    <div className="w-full overflow-x-hidden relative antialiased">

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-bold text-sky-600">Paikar (EPS)</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-sky-50"
          >
            <X className="h-5 w-5 text-sky-700" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-3">
          <MobileLink to="/" onClick={() => setOpen(false)}>Home</MobileLink>

          {/* FIXED SCROLL */}
          <button
            onClick={() => {
              setOpen(false);
              setTimeout(scrollToFeatures, 150);
            }}
            className="block w-full text-left px-3 py-2 text-sky-700 rounded-md hover:bg-sky-50 font-medium"
          >
            Features
          </button>

          <MobileLink to="/appointment" onClick={() => setOpen(false)}>Appointment</MobileLink>
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

      {/* Floating PWA install (hidden until JS enables) */}
      <button
        id="pwa-floating-btn"
        className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-xl hover:bg-sky-700 z-40 hidden"
      >
        <Smartphone className="h-6 w-6" />
      </button>

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 md:px-16 py-4 bg-white z-20 relative">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-sky-50"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6 text-sky-600" />
          </button>
          <h1 className="text-2xl font-bold text-sky-600">Paikar (EPS)</h1>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-sky-600">Home</Link>

          {/* FIXED SCROLL */}
          <button onClick={scrollToFeatures} className="hover:text-sky-600">
            Features
          </button>

          <Link to="/appointment" className="hover:text-sky-600">Appointment</Link>
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

      {/* HERO */}
      <section className="relative px-6 md:px-16 py-20 bg-gradient-to-b from-sky-50 to-white">

        <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-sky-700 leading-tight">
              Smart Electronic Prescription & Appointment System
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Fast, secure, and doctor-friendly EPS platform designed to make healthcare simpler and paper-free.
            </p>

            <div className="mt-6 flex gap-4">
              <Link
                to="/appointment"
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow"
              >
                Book Appointment
              </Link>

              <button className="px-6 py-3 border border-sky-300 text-sky-700 rounded-xl hover:bg-sky-100">
                Watch Demo
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:w-3/4">
              <MiniFeature icon={<Calendar className="h-5 w-5 text-sky-600" />} title="Easy Appointments" />
              <MiniFeature icon={<ShieldCheck className="h-5 w-5 text-sky-600" />} title="Secure Prescriptions" />
              <MiniFeature icon={<FileText className="h-5 w-5 text-sky-600" />} title="Paperless" />
              <MiniFeature icon={<Smartphone className="h-5 w-5 text-sky-600" />} title="Mobile Friendly" />
            </div>
          </div>

          <div className="flex justify-center relative">
            <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-8 w-80 md:w-96">
              <img
                src="/doctor-illustrator.jpg"
                alt="Doctor Illustration"
                className="w-60 mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-16 py-16 bg-white">
        <h3 className="text-3xl font-bold text-sky-700 text-center">Why Choose Our EPS?</h3>
        <p className="text-center text-gray-600 mt-2">Designed for doctors & patients with speed & accuracy.</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard Icon={Calendar} title="Easy Appointments" text="Patients can book appointments instantly." />
          <FeatureCard Icon={ShieldCheck} title="Secure Prescriptions" text="Encrypted and safely stored in cloud." />
          <FeatureCard Icon={FileText} title="Paperless System" text="Eliminate handwriting errors forever." />
          <FeatureCard Icon={Smartphone} title="Mobile Friendly" text="Works like an app on any device." />
          <FeatureCard Icon={CheckCircle2} title="Doctor Templates" text="Save reusable prescription layouts." />
          <FeatureCard Icon={Star} title="Trusted by Clinics" text="Clinics use EPS daily to save time." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 bg-sky-50">
        <h3 className="text-3xl font-bold text-sky-700 text-center">How It Works</h3>

        <div className="grid md:grid-cols-3 gap-10 mt-12 text-center">
          <StepCard number="1" title="Choose Doctor" text="Browse verified doctors." />
          <StepCard number="2" title="Pick Date & Time" text="Check available slots." />
          <StepCard number="3" title="Confirm Booking" text="Receive an instant confirmation." />
        </div>
      </section>

      {/* PWA Install Section */}
      <PWASection />


      {/* CTA */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center">
        <h3 className="text-4xl font-bold">Ready to Book Your Appointment?</h3>
        <p className="mt-3 text-lg opacity-90">Fast, secure, and paperless healthcare experience.</p>

        <Link
          to="/appointment"
          className="inline-block mt-6 px-8 py-4 bg-white text-sky-700 font-semibold rounded-xl shadow hover:bg-sky-100"
        >
          Book Now
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-sky-900 text-sky-100 px-6 md:px-16 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h1 className="text-2xl font-bold text-white">EPS System</h1>
            <p className="text-sky-200 mt-2">
              Secure, fast, modern electronic prescription platform.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sky-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/appointment" className="hover:text-white">Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Contact</h4>
            <p className="text-sky-200">Email: PaikarSoftware@gmail.com</p>
            <p className="text-sky-200">Phone: +93 783 23 11 88</p>
          </div>
        </div>

        <div className="text-center text-sky-300 mt-10 text-sm">
          © {new Date().getFullYear()} Paikar EPS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* COMPONENTS */

function MobileLink({ children, to, onClick }) {
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

function MiniFeature({ icon, title }) {
  return (
    <div className="flex items-center gap-3 bg-white/60 rounded-lg p-2">
      <div className="p-2 rounded bg-sky-50">{icon}</div>
      <div className="text-sm text-gray-700">{title}</div>
    </div>
  );
}

function FeatureCard({ Icon, title, text }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-sky-600" />
        <h4 className="text-xl font-semibold text-sky-700">{title}</h4>
      </div>
      <p className="text-gray-600 mt-3">{text}</p>
    </div>
  );
}

function StepCard({ number, title, text }) {
  return (
    <div className="p-8 bg-white rounded-xl shadow text-center">
      <div className="w-16 h-16 mx-auto flex items-center justify-center bg-sky-600 text-white text-3xl font-bold rounded-full">
        {number}
      </div>
      <h4 className="text-2xl font-semibold text-sky-700 mt-4">{title}</h4>
      <p className="text-gray-600 mt-2">{text}</p>
    </div>
  );
}



function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowButton(false);
    });
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 bg-sky-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Install App
    </button>
  );
}




function PWASection() {
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const btnMain = document.getElementById("pwa-install-main");
    const btnFloating = document.getElementById("pwa-floating-btn");

    function showButtons() {
      if (btnMain) btnMain.classList.remove("hidden");
      if (btnFloating) btnFloating.classList.remove("hidden");
    }

    function beforeInstallHandler(e) {
      e.preventDefault();
      deferredPromptRef.current = e;
      showButtons();
    }

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);

    async function installApp() {
      const deferredPrompt = deferredPromptRef.current;
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        deferredPromptRef.current = null;
        if (btnMain) btnMain.classList.add("hidden");
        if (btnFloating) btnFloating.classList.add("hidden");
      }
    }

    if (btnMain) btnMain.addEventListener("click", installApp);
    if (btnFloating) btnFloating.addEventListener("click", installApp);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      if (btnMain) btnMain.removeEventListener("click", installApp);
      if (btnFloating) btnFloating.removeEventListener("click", installApp);
    };
  }, []);

  return (
    <section className="px-6 md:px-16 py-16 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-sky-700">
          Install EPS on Your Phone or Computer
        </h3>

        <p className="mt-3 text-gray-600 text-lg">
          Use EPS like a real mobile app — faster access, offline support, and a better user experience.
        </p>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
            <Smartphone className="h-10 w-10 text-sky-600" />
            <div className="text-left">
              <h4 className="text-xl font-semibold text-sky-700">Mobile App</h4>
              <p className="text-gray-600 text-sm">Install on Android & iOS</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
            <FileText className="h-10 w-10 text-sky-600" />
            <div className="text-left">
              <h4 className="text-xl font-semibold text-sky-700">Desktop Mode</h4>
              <p className="text-gray-600 text-sm">Install on Windows & Mac</p>
            </div>
          </div>
        </div>
        <InstallPWA />
        <button
          id="pwa-install-main"
          className=" mt-10 px-8 py-4 bg-sky-600 text-white text-lg rounded-xl shadow hover:bg-sky-700 transition"
        >
          Install App
        </button>
      </div>
    </section>
  );
}

export default HomePage;
