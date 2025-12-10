import api from './axios';

export async function getAllDoctors({ seter }){
  try{
      const res = await api.get("/visitor/doctors")
      seter(res.data.data)
  }catch(err){
      console.error('Doctor Details:',err)
  }
}

export async function getDoctorTiming({ seter, id }){
  try{
      const res = await api.get(`/visitor/doctor-timing/${id}`)
      seter(res.data.today)
  }catch(err){
      console.error('Doctor Details:',err)
  }
}

export async function createAppointment(data) {
  try {
    // ------------------------------
    // Frontend validations
    // ------------------------------
    if (!data.patient_name || data.patient_name.trim().length < 3) {
      throw new Error("Full name is required");
    }

    if (!data.age || data.age < 0 || data.age > 120) {
      throw new Error("Age must be between 0 and 120");
    }

    if (!data.phone || !/^[0-9]{10,14}$/.test(data.phone)) {
      throw new Error("Please enter a valid phone number");
    }

    if (!data.doctors_id) {
      throw new Error("Doctor ID is required");
    }

    // ------------------------------
    // Correct API endpoint
    // ------------------------------
    const response = await api.post(`/visitor/appointment`, data);

    return response.data;

  } catch (error) {
    console.error("Create appointment error:", error.response.data);

    // Always throw a readable message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Cannot create appointment");
  }
}

export async function getAppointmentsByDeviceId({ seter, device_id }){
  try{
      const res = await api.get(`/visitor/appointment/${device_id}`)
      seter(res.data.appointments)
  }catch(err){
      console.error('Appointments Details:',err)
  }
}