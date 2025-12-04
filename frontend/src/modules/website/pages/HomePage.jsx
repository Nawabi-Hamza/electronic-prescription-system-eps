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

  return (
    <div className="w-full overflow-x-hidden relative antialiased">
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
          <MobileLink to="/#features" onClick={() => setOpen(false)}>Features</MobileLink>
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

    {/* Floating PWA Install FAB */}
    <button 
      id="pwa-floating-btn"
      className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-xl hover:bg-sky-700 z-40 hidden"
    >
      <Smartphone className="h-6 w-6" />
    </button>

      {/* HEADER */}
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
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <Link to="#features" className="hover:text-sky-600">Features</Link>
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

      {/* HERO (with SVG decorations) */}
      <section className="relative px-6 md:px-16 py-20 bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        {/* Decorative SVG blobs & shapes (mix) */}
        <svg className="absolute -top-10 -left-10 opacity-30" width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path d="M80 0C120 -4 210 8 260 42C310 76 320 152 268 196C216 240 120 268 64 236C8 204 40 48 80 0Z" fill="url(#g1)"/>
        </svg>

        <svg className="absolute -bottom-24 -right-24 opacity-20" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stopColor="#bae6fd" />
              <stop offset="1" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          <circle cx="210" cy="210" r="200" fill="url(#g2)" />
        </svg>

        {/* Small floating circles */}
        <div className="absolute right-28 top-20 space-y-3">
          <div className="w-4 h-4 rounded-full bg-sky-200 opacity-90" />
          <div className="w-6 h-6 rounded-full bg-sky-300 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-sky-100 opacity-90" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-sky-700 leading-tight">
              Smart Electronic Prescription & Appointment System
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Fast, secure, and doctor-friendly EPS platform designed to make healthcare simpler, safer, and paper-free.
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

            {/* small feature row */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:w-3/4">
              <MiniFeature icon={<Calendar className="h-5 w-5 text-sky-600" />} title="Easy Appointments" />
              <MiniFeature icon={<ShieldCheck className="h-5 w-5 text-sky-600" />} title="Secure Prescriptions" />
              <MiniFeature icon={<FileText className="h-5 w-5 text-sky-600" />} title="Paperless" />
              <MiniFeature icon={<Smartphone className="h-5 w-5 text-sky-600" />} title="Mobile Friendly" />
            </div>
          </div>

          <div className="flex justify-center relative">
            {/* layered card with small svg corner */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-8 w-80 md:w-96">
              <img
                src="/doctor-illustrator.jpg"
                alt="Doctor Illustration"
                className="w-60 md:w-100 mx-auto"
              />

              <svg className="absolute -top-6 -right-6 opacity-90" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="corner" x1="0" x2="1">
                    <stop offset="0" stopColor="#38bdf8" />
                    <stop offset="1" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path d="M0 0 L120 0 L120 120 Z" fill="url(#corner)" opacity="0.18" />
              </svg>
            </div>

            {/* subtle floating accent */}
            <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-sky-200 opacity-70 blur-sm" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-16 py-16 bg-white relative">
        {/* decorative wave */}
        <svg className="absolute left-0 -top-10 opacity-10" width="420" height="140" viewBox="0 0 420 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80 C80 0 240 180 420 40 L420 140 L0 140 Z" fill="#e6f6ff" />
        </svg>

        <h3 className="text-3xl font-bold text-sky-700 text-center">Why Choose Our EPS?</h3>
        <p className="text-center text-gray-600 mt-2">Designed for doctors and patients with speed and accuracy.</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            Icon={Calendar}
            title="Easy Appointments"
            text="Patients can book appointments in seconds with live availability."
          />

          <FeatureCard
            Icon={ShieldCheck}
            title="Secure Prescriptions"
            text="Encrypted digital prescriptions stored safely in the cloud."
          />

          <FeatureCard
            Icon={FileText}
            title="Paperless & Error-Free"
            text="Clear, digital, and accurate prescriptions—no handwriting errors."
          />

          <FeatureCard
            Icon={Smartphone}
            title="Mobile Friendly"
            text="Accessible on any device—web, mobile, or tablet. using as application."
          />

          <FeatureCard
            Icon={CheckCircle2}
            title="Doctor Templates"
            text="Doctors can save custom prescription templates for fast reuse."
          />

          <FeatureCard
            Icon={Star}
            title="Trusted by Clinics"
            text="Used by healthcare professionals daily."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 bg-sky-50 relative overflow-hidden">
        {/* abstract shapes */}
        <svg className="absolute right-4 top-8 opacity-20" width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="160" height="160" rx="40" fill="#bae6fd" />
        </svg>

        <h3 className="text-3xl font-bold text-sky-700 text-center">How It Works</h3>

        <div className="grid md:grid-cols-3 gap-10 mt-12 text-center">
          <StepCard
            number="1"
            title="Choose Doctor"
            text="Select your specialist from our verified list."
          />
          <StepCard
            number="2"
            title="Pick Date & Time"
            text="View available slots in real-time."
          />
          <StepCard
            number="3"
            title="Confirm Booking"
            text="Get instant confirmation via SMS & Email."
          />
        </div>
      </section>

      {/* PWA INSTALL SECTION */}
      <PWASection />

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center relative">
        <svg className="absolute -top-20 left-0 opacity-10" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="210" cy="210" r="200" fill="#ffffff" />
        </svg>

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
            <p className="text-sky-200 mt-2">Secure, fast, and modern electronic prescription system.</p>
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
          © {new Date().getFullYear()} Paikar -EPS- System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

/* ---------- smaller components ---------- */

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

export default HomePage;



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

// export default HomePage;
