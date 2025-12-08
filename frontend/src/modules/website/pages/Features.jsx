import React from "react";
import {
  FilePlus,
  Database,
  CalendarCheck,
  Smartphone,
  ShieldCheck,
  FileSignature,
  History,
  LayoutDashboard,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: <FilePlus className="h-10 w-10 text-sky-600" />,
      title: "Smart Digital Prescription",
      desc: "Create neat, secure, and auto-formatted prescriptions with drug auto-suggestions.",
    },
    {
      icon: <Database className="h-10 w-10 text-sky-600" />,
      title: "Advanced Drug Database",
      desc: "Searchable medicines, categories, dosage forms, and smart recommendations.",
    },
    {
      icon: <LayoutDashboard className="h-10 w-10 text-sky-600" />,
      title: "Doctor Dashboard",
      desc: "Track daily visits, issued prescriptions, recent patients, and analysis charts.",
    },
    {
      icon: <CalendarCheck className="h-10 w-10 text-sky-600" />,
      title: "Online Appointment Booking",
      desc: "Patients can schedule visits anytime with automated confirmations.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-sky-600" />,
      title: "PWA Mobile App",
      desc: "Install EPS like a real mobile app on Android, iOS, Windows & Mac.",
    },
    {
      icon: <History className="h-10 w-10 text-sky-600" />,
      title: "Patient Medical History",
      desc: "View historical prescriptions, medications, and visit summaries.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-sky-600" />,
      title: "Secure & Encrypted",
      desc: "Access controlled, JWT secured API, and doctor–patient data protection.",
    },
    {
      icon: <FileSignature className="h-10 w-10 text-sky-600" />,
      title: "E-Signature & Templates",
      desc: "Doctors design their prescription header once and reuse anytime.",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden relative antialiased bg-white">
      {/* Header Section */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-b from-sky-100/80 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-700">
            Powerful Features of EPS
          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            Everything doctors and patients need — secure, fast, and beautifully designed.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all shadow shadow-sky-100"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-sky-700">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 py-20 bg-sky-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-sky-700">
            EPS Makes Your Clinic Faster, Smarter & Paperless
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Join hundreds of doctors who already use EPS to improve their workflow.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Features;
