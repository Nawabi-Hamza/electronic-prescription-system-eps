import api from './axios';

export async function getAllDoctors({ seter }){
  try{
      const res = await api.get("/visitor/doctors")
      seter(res.data.data)
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
