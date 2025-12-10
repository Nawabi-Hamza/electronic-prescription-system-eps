import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Search, User, Calendar, Clock } from "lucide-react";
import { badge, btnStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { createAppointment, getAllDoctors, getDoctorTiming } from "../../../api/visitorAPI";
import ImageViewer from "../../../componenets/ImageViewer";
import { FormatToAmPm } from "../../../componenets/Date&Time";
import { toast } from "react-toastify";
import { getDeviceId } from "../../../utils/deviceID";


// Fake timing for demo

export default function Appoinment() {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm();


    const onSubmit = async (data) => {
        try{
        
    
            await createAppointment({ doctors_id:selectedDoctor.id, ...data, device_id: getDeviceId() });
            await new Promise((r) => setTimeout(r, 800));

            toast.success("Appointment Successfully Booked!");
            reset();
            setStep(1);
            setSelectedDoctor(null);
        }catch(err){
            toast.error(err.message)
            console.log(err.message)
        }
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
        {step === 1 && (<StepOneDoctorList  setSelectedDoctor={setSelectedDoctor} setStep={setStep} />)}

        {/* STEP 2 – PATIENT INFORMATION */}
        {step === 2 && (<StepTwoForm setStep={setStep} handleSubmit={handleSubmit} register={register} errors={errors} />)}

        {/* STEP 3 – DOCTOR TIMING */}
        {step === 3 && (<StepThreeNumber selectedDoctor={selectedDoctor} handleSubmit={handleSubmit} onSubmit={onSubmit} setStep={setStep} isSubmitting={isSubmitting}  />)}
      </div>
    </div>
  );
}


function StepOneDoctorList({ setSelectedDoctor, setStep, handleSubmit }){
    const [doctorsList, setDoctorsList] = useState([])
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5; // show 10 doctors per page

    useEffect(() => { getAllDoctors({ seter: setDoctorsList}) }, [handleSubmit])

    const filteredDoctors = useMemo(() => {
        const term = search.toLowerCase();
        return doctorsList?.filter((s) => 
            (s.name +" "+ s.lastname)?.toLowerCase().includes(term) ||
            s.clinic_name?.toLowerCase().includes(term) 
        )
    }, [doctorsList, search]);

    const totalPages = Math.ceil(filteredDoctors.length / pageSize);
    const currentPageDoctors = filteredDoctors.slice((page - 1) * pageSize, page * pageSize);

    return(<>
        <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-bold mb-4">Find Your Doctor</h2>
            {/* Search Doctor */}
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

            {/* Doctors List */}
            <div className="mt-5 space-y-3">
              {currentPageDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(2);
                  }}
                  className="p-4 relative flex gap-2 items-center shadow-sm rounded cursor-pointer bg-white hover:bg-blue-50 transition"
                >
                <div>
                    <ImageViewer 
                        imagePath={`/uploads/profiles/${doc.photo}`}
                        altText={doc.name}
                        showPreview={false}
                        className="h-10 w-10 object-cover rounded"
                    />
                </div>
                 <div>
                  <p className="font-semibold">Dr. {doc.name} {doc.lastname}</p>
                  <p className="text-sm text-gray-600">{doc.clinic}</p>
                 </div>
                 <span className={badge.primarySm+" absolute right-2"}>Fees: {doc.fee}AF</span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4"> 
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" > Prev </button>
                <span className="px-3 py-1 bg-gray-100 rounded">{page} / {totalPages}</span> 
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" > Next </button> 
            </div>
        </div>
    </>)
}


function StepTwoForm({ setStep, handleSubmit, register, errors }){  

    return(<>
        <form onSubmit={handleSubmit(() => setStep(3))} className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <h2 className="text-xl font-bold mb-4">Patient Information</h2>

            {/* Full Name */}
            <div>
              <label className={labelStyle.primary}>Full Name</label>
              <input
                {...register("patient_name", {
                  required: "Required",
                  minLength: { value: 3, message: "Too short" },
                })}
                className={inputStyle.primary}
                placeholder="Patinet Full Name"
              />
              {errors.patient_name && (<p className="text-red-500 text-sm">{errors.patient_name.message}</p>)}
            </div>
        
            <div className="grid grid-cols-2 gap-2">
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
                        placeholder="Phone Number like (0783123456)"
                    />
                    {errors.phone && (<p className="text-red-500 text-sm">{errors.phone.message}</p>)}
                </div>
                {/* Age */}
                <div>
                    <label className={labelStyle.primary}>Age</label>
                    <input
                        type="number"
                        {...register("age", {
                            required: "Required",
                            min: { value: 0, message: "Age cannot be negative" },
                            max: { value: 150, message: "Age cannot exceed 150" },
                        })}
                        className={inputStyle.primary}
                        placeholder="Patient Age"
                    />
                    {errors.age && (<p className="text-red-500 text-sm">{errors.age.message}</p>)}
                </div>
            </div>

            {/* Message */}
            <div>
            <label className={labelStyle.primary}>Message (optional)</label>
            <textarea
                {...register("description", {
                maxLength: {
                    value: 255,
                    message: "Message cannot exceed 255 characters",
                },
                })}
                rows={5}
                className={inputStyle.primary+" max-h-40"}
                placeholder="Tell about your sickness"
                maxLength={255} // limits input in the browser
            ></textarea>
            {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
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
              <button className={btnStyle.filled}>
                Continue
              </button>
            </div>
        </form>
    </>)
}



function StepThreeNumber({ selectedDoctor, handleSubmit, onSubmit, isSubmitting, setStep, }) {
  const [doctorId] = useState(selectedDoctor.id || null);
  const [timing, setTiming] = useState(null);
  useEffect(() => {
    getDoctorTiming({ seter: setTiming, id: doctorId });
  }, [doctorId]);

  const totalBooked = timing?.total_booked_patients || 0;
  const totalPossible = timing?.total_possible_patients || 0;
  const fullyBooked = totalBooked >= totalPossible;

  return (
    <div className="animate-[fadeIn_0.3s_ease] space-y-4">

      {/* === Info Card === */}
      {timing && timing?.status!=="close" && (
        <div className="p-5 rounded  space-y-2">

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              {timing.day?.toUpperCase()} — Today
            </h3>

            {fullyBooked && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">
                FULLY BOOKED
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 pt-2">
            <p className="bg-gray-50 p-2 rounded-lg font-medium">
              🟢 Open:
              <span className="font-bold ml-1">
                {FormatToAmPm(timing.in_time)}
              </span>
            </p>

            <p className="bg-gray-50 p-2 rounded-lg font-medium">
              🔴 Close:
              <span className="font-bold ml-1">
                {FormatToAmPm(timing.out_time)}
              </span>
            </p>

            <p className="bg-gray-50 p-2 rounded-lg">
              <b>Total Slots:</b> {timing.total_slots}
            </p>

            <p className="bg-gray-50 p-2 rounded-lg">
              <b>Max Patients:</b> {totalPossible}
            </p>
          </div>

          <div className="mt-3 p-3 rounded-md bg-gradient-to-r from-sky-50 to-blue-50  flex flex-wrap justify-between">
            <div className="text-green-700 font-semibold">
              Taken Today: {totalBooked}
            </div>

            <div className="text-sky-700 font-semibold">
              Remaining: {totalPossible - totalBooked}
            </div>
          </div>
        </div>
      )}
    {timing && timing?.status==="close" ?
        <div>
            <p className={badge.dangerSm+" sm:text-2xl sm:p-4"}>⚠️ Doctor is not in clinic today, clinic is closed!</p>
            <button
                className="px-4 py-2 bg-gray-200 rounded-md mt-4 hover:bg-gray-300 transition"
                onClick={() => setStep(1)}
                >
                Back
            </button>
        </div>
        :
        <>
            {/* === Slot Selection (Horizontal Scroll) === */}
            <h2 className="text-xl font-bold mb-2">Your Number</h2>

            <div className="flex gap-2 items-center mb-4">
            {/* Current number the user will get */}
            {timing && (
                <button
                className="min-w-[70px] px-4 py-2 rounded-lg border text-center shadow-sm bg-sky-600 text-white font-bold"
                disabled
                >
                {timing.next_available_number}
                </button>
            )}

            <span className="text-gray-600"> — Your ticket number</span>
            </div>

            <h2 className="text-lg font-semibold mb-2">Taken Numbers</h2>

            <div className="flex gap-2 flex-wrap">
            {timing?.taken_numbers?.map((num) => (
                <button
                key={num}
                className="min-w-[50px] px-3 py-1 rounded-lg border text-center bg-gray-200 text-gray-500 cursor-not-allowed"
                disabled
                >
                #{num}
                </button>
            ))}

            {timing?.taken_numbers?.length === 0 && (
                <p className="text-gray-500">No numbers taken yet</p>
            )}
            </div>



            {/* === Buttons === */}
            <div className="flex justify-between mt-6">
                <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => setStep(2)}
                >
                Back
                </button>

                <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || fullyBooked}
                className={btnStyle.filled+" disabled:bg-gray-300"}
                >
                {isSubmitting ? "Booking..." : fullyBooked ? "Fully Booked" : "Confirm"}
                </button>
            </div>
        </>
    }
    </div>
  );
}
