import api from './axios';

export async function getAllMedicine({ seter }){
  try{
      const res = await api.get("/doctor/medicine")
      seter(res.data.records)
  }catch(err){
      console.error('Doctor Details:',err)
  }
}

export async function addNewMedicine(data) {
  try {
    if(!data.name) throw "Name is required"
    const response = await api.post(`/doctor/medicine`, data);
    return response.data;  
  } catch (error) {
    console.error("Add medicine error:", error);
    throw error;
  }
}

export async function deleteMedicine(id) {
  try {
    const response = await api.delete(`/doctor/medicine/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete medicine error:", error);
    throw error;
  }
}

export async function getAllPayments({ seter }){
  try{
      const res = await api.get("/doctor/payments")
      seter(res.data.payments)
  }catch(err){
      console.error('Doctor Details:',err)
  }
}


export  const fetchPrescriptionHeader = async ({ seter }) => {
    try {
      const res = await api.get("/doctor/prescription/header");
      if (res.data.status && res.data.data) {
        seter(res.data.data);
      }
    } catch (err) {
      console.error("Fetch header error:", err);
    }
  };