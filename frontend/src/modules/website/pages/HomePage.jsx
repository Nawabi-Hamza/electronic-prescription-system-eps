import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, ShieldCheck, FileText, Smartphone, CheckCircle2, Star, ArrowBigRight, TvMinimalPlay, } from "lucide-react";

function HomePage() {

  return (
    <>


      {/* HERO (with SVG decorations) */}
      <HeroSection />

      {/* FEATURES */}
      <FeaturesSection />

      {/* HOW IT WORKS */}
      <HowItWork />

      {/* PWA INSTALL SECTION */}
      <PWASection />

      {/* CTA */}
      <CTA />


    </>
  );
}

function HeroSection(){
  return(<>
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

            <div className="mt-6 grid lg:grid-cols-2 gap-4">
              <Link
                to="/appointment"
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 shadow flex items-center justify-between"
              >
                <span>Book Appointment</span><span><ArrowBigRight /></span> 
              </Link>

              <Link to="https://www.facebook.com/share/v/1BRwZgciou/" target="_blank" className="px-6 flex items-center gap-2 py-3 border border-sky-300 text-sky-700 rounded-xl hover:bg-sky-100">
                <TvMinimalPlay /> Watch Demo
              </Link>
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
  </>)
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

function FeaturesSection(){
  return(<>
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
  </>)
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

function HowItWork(){
  return(<>
      <section className="px-6 md:px-16 py-16 bg-sky-50 relative overflow-hidden">
        {/* abstract shapes */}
        <svg className="absolute right-4 top-8 opacity-20" width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="160" height="160" rx="40" fill="#bae6fd" />
        </svg>

        <h3 className="text-3xl font-bold text-sky-700 text-center">How It Works</h3>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-10 mt-12 text-center">
          <StepCard
            number="1"
            title="Choose Doctor"
            text="Select your specialist from our verified list."
          />
          <StepCard
            number="2"
            title="Fill Form"
            text="Tell about your self to submit your appointment."
          />
          <StepCard
            number="3"
            title="Confirm Booking"
            text="Get instant confirmation via SMS & Email."
          />
        </div>
      </section>
  </>)
}

function CTA(){
  return(<>
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r bg-[#0084d1] text-white text-center relative">
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
  </>)
}

function PWASection() {
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const btnMain = document.getElementById("pwa-install-main");
    const btnFloating = document.getElementById("pwa-floating-btn");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    function showButtons() {
      if (btnMain) btnMain.classList.remove("hidden");
      if (btnFloating) btnFloating.classList.remove("hidden");
    }

    function hideButtons() {
      if (btnMain) btnMain.classList.add("hidden");
      if (btnFloating) btnFloating.classList.add("hidden");
    }

    function beforeInstallHandler(e) {
      e.preventDefault();
      deferredPromptRef.current = e;
      showButtons();
    }

    async function installApp() {
      const deferredPrompt = deferredPromptRef.current;

      // Desktop fallback (Chrome / Edge PC)
      if (!deferredPrompt) {
        alert(
          "To install on desktop, click the install icon in the browser address bar."
        );
        return;
      }

      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        deferredPromptRef.current = null;
        hideButtons();
      }
    }

    // Mobile & some desktop cases
    window.addEventListener("beforeinstallprompt", beforeInstallHandler);

    // Desktop heuristic fallback (PC often never fires beforeinstallprompt)
    setTimeout(() => {
      if (!deferredPromptRef.current) {
        showButtons();
      }
    }, 3000);

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
          Use EPS like a real app — faster access, offline support, and a better experience.
        </p>

        <div
          id="pwa-install-main"
          className="mt-8 flex  md:flex-row items-center justify-center gap-6 cursor-pointer"
        >
          <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
            <Smartphone className="h-10 w-10 text-sky-600" />
            <div className="text-left">
              <h4 className="text-xl font-semibold text-sky-700">Mobile App</h4>
              <p className="text-gray-600 text-sm">Android & iOS</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
            <FileText className="h-10 w-10 text-sky-600" />
            <div className="text-left">
              <h4 className="text-xl font-semibold text-sky-700">Desktop Mode</h4>
              <p className="text-gray-600 text-sm">Windows & macOS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// function PWASection() {
//   const deferredPromptRef = useRef(null);

//   useEffect(() => {
//     const btnMain = document.getElementById("pwa-install-main");
//     const btnFloating = document.getElementById("pwa-floating-btn");

//     function showButtons() {
//       if (btnMain) btnMain.classList.remove("hidden");
//       if (btnFloating) btnFloating.classList.remove("hidden");
//     }

//     function beforeInstallHandler(e) {
//       e.preventDefault();
//       deferredPromptRef.current = e;
//       showButtons();
//     }

//     window.addEventListener("beforeinstallprompt", beforeInstallHandler);

//     async function installApp() {
//       const deferredPrompt = deferredPromptRef.current;
//       if (!deferredPrompt) return;

//       deferredPrompt.prompt();
//       const choiceResult = await deferredPrompt.userChoice;

//       if (choiceResult.outcome === "accepted") {
//         deferredPromptRef.current = null;
//         if (btnMain) btnMain.classList.add("hidden");
//         if (btnFloating) btnFloating.classList.add("hidden");
//       }
//     }

//     if (btnMain) btnMain.addEventListener("click", installApp);
//     if (btnFloating) btnFloating.addEventListener("click", installApp);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
//       if (btnMain) btnMain.removeEventListener("click", installApp);
//       if (btnFloating) btnFloating.removeEventListener("click", installApp);
//     };
//   }, []);

//   return (
//     <section className="px-6 md:px-16 py-16 bg-white">
//       <div className="max-w-4xl mx-auto text-center">
//         <h3 className="text-3xl font-bold text-sky-700">
//           Install EPS on Your Phone or Computer
//         </h3>

//         <p className="mt-3 text-gray-600 text-lg">
//           Use EPS like a real mobile app — faster access, offline support, and a better user experience.
//         </p>

//         <div id="pwa-install-main" className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
//           <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
//             <Smartphone className="h-10 w-10 text-sky-600" />
//             <div className="text-left">
//               <h4 className="text-xl font-semibold text-sky-700">Mobile App</h4>
//               <p className="text-gray-600 text-sm">Install on Android & iOS</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 bg-sky-50 px-6 py-4 rounded-xl shadow hover:shadow-lg transition">
//             <FileText className="h-10 w-10 text-sky-600" />
//             <div className="text-left">
//               <h4 className="text-xl font-semibold text-sky-700">Desktop Mode</h4>
//               <p className="text-gray-600 text-sm">Install on Windows & Mac</p>
//             </div>
//           </div>
//         </div>
//         {/* <button
//           id="pwa-install-main"
//           className=" mt-10 px-8 py-4 bg-sky-600 text-white text-lg rounded-xl shadow hover:bg-sky-700 transition"
//         >
//           Install App
//         </button> */}
//       </div>
//     </section>
//   );
// }
export default HomePage;

