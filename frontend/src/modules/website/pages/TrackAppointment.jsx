import React, { useEffect, useRef, useState } from "react";
import { getAppointmentsByDeviceId } from "../../../api/visitorAPI";
import ImageViewer from "../../../componenets/ImageViewer";
import { badge } from "../../../styles/componentsStyle";

function TrackAppointment() {
  const [appointments, setAppointments] = useState([]);
  const fetchedRef = useRef(false); // ✅ prevent multiple fetches

  useEffect(() => {
    if (fetchedRef.current) return; // already fetched
    fetchedRef.current = true;

    const deviceId = localStorage.getItem("client_device_id");
    if (!deviceId) return;

    // fetch appointments once
    getAppointmentsByDeviceId({ seter: setAppointments, device_id: deviceId });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>

      {appointments.length === 0 && (
        <p className="text-gray-500">No active appointments today.</p>
      )}

      {appointments.map((appt) => (
        <div
          key={appt.id}
          className="p-4 rounded shadow flex flex-col sm:flex-row items-center gap-4 bg-white"
        >
          {/* Doctor Photo */}
          <ImageViewer
            imagePath={`/uploads/profiles/${appt.doctor_photo}`}
            alt={appt.doctor_name}
            className="w-16 h-16 rounded object-cover"
            showPreview={false}
          />

          {/* Doctor & Clinic Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{appt.patient_name}</h2>
            <p className="text-gray-600 capitalize">{appt.clinic_name}</p>
            <p className={badge.primarySm+" inline"}>Dr. {appt.doctor_name}</p>
          </div>

          {/* User Visit Number */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Your Number</p>
            <p className="text-2xl font-bold text-sky-600">{appt.visit_number}</p>
          </div>

          {/* Latest Number Visited */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Currently Visiting</p>
            <p className="text-2xl font-bold text-green-600">
              {appt.latest_patient?.visit_number || "-"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackAppointment;
