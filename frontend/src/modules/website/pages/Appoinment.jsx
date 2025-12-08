import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, User, Calendar, Clock } from "lucide-react";
import { inputStyle, labelStyle } from "../../../styles/componentsStyle";

// Fake Doctors for Demo
const doctorsList = [
  { id: 1, name: "Dr. Ahmad Rahimi", specialty: "Cardiologist" },
  { id: 2, name: "Dr. Laila Mohammadi", specialty: "Dermatologist" },
  { id: 3, name: "Dr. Omar Safi", specialty: "Neurologist" },
];

// Fake timing for demo
const timings = ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

export default function Appoinment() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const filteredDoctors = doctorsList.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async (data) => {
    const payload = {
      doctor: selectedDoctor,
      patient: data,
      time: selectedTime,
    };

    console.log("Final Appointment Data:", payload);

    await new Promise((r) => setTimeout(r, 800));
    alert("Appointment Successfully Booked!");

    reset();
    setStep(1);
    setSelectedDoctor(null);
    setSelectedTime(null);
  };

  return (
    <div className=" bg-gray-100 flex justify-center py-10 px-4 antialiased animate__fadeIn animate__animated animate__delay-.5s">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
        
        {/* STEP HEADER */}
        <div className="flex items-center justify-between mb-8">
          {/* STEP 1 */}
          <div
            className={`flex flex-col items-center text-gray-400 transition ${
              step >= 1 ? "text-sky-600 font-semibold" : ""
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <p>Doctor</p>
          </div>

          <div
            className={`h-1 w-16 rounded transition ${
              step >= 2 ? "bg-sky-600" : "bg-gray-300"
            }`}
          ></div>

          {/* STEP 2 */}
          <div
            className={`flex flex-col items-center text-gray-400 transition ${
              step >= 2 ? "text-sky-600 font-semibold" : ""
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            <p>Patient</p>
          </div>

          <div
            className={`h-1 w-16 rounded transition ${
              step === 3 ? "bg-sky-600" : "bg-gray-300"
            }`}
          ></div>

          {/* STEP 3 */}
          <div
            className={`flex flex-col items-center text-gray-400 transition ${
              step === 3 ? "text-sky-600 font-semibold" : ""
            }`}
          >
            <Clock className="w-6 h-6 mb-1" />
            <p>Timing</p>
          </div>
        </div>

        {/* STEP 1 – FIND DOCTOR */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-bold mb-4">Find a Doctor</h2>

            <div className="relative items-center ">
              <Search className="text-gray-500 absolute top-2 right-2" />
              <input
                type="text"
                className={inputStyle.primary+""}
                placeholder="Search doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mt-5 space-y-3">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(2);
                  }}
                  className="p-4 shadow-sm rounded cursor-pointer bg-white hover:bg-blue-50 transition"
                >
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 – PATIENT INFORMATION */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(() => setStep(3))}
            className="space-y-4 animate-[fadeIn_0.3s_ease]"
          >
            <h2 className="text-xl font-bold mb-4">Patient Information</h2>

            {/* Full Name */}
            <div>
              <label className={labelStyle.primary}>Full Name</label>
              <input
                {...register("fullName", {
                  required: "Required",
                  minLength: { value: 3, message: "Too short" },
                })}
                className={inputStyle.primary}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelStyle.primary}>Phone Number</label>
              <input
                {...register("phone", {
                  required: "Required",
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: "Invalid phone",
                  },
                })}
                className={inputStyle.primary}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className={labelStyle.primary}>Message (optional)</label>
              <textarea
                {...register("message")}
                rows={5}
                className={inputStyle.primary}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-blue-700 transition">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 – DOCTOR TIMING */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-bold mb-4">
              Select Timing for {selectedDoctor?.name}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {timings.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`p-3  rounded-lg text-center transition shadow-sm ${
                    selectedTime === t
                      ? "bg-sky-600 text-white"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => setStep(2)}
              >
                Back
              </button>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!selectedTime || isSubmitting}
                className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50 hover:bg-sky-700 transition"
              >
                {isSubmitting ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
