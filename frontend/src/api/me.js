// src/api/user.js
import api from './axios';

export async function getPaymentsDetails({ seter }){
  try{
      const res = await api.get("/doctor/profile/payments")
      seter(res.data)
  }catch(err){
      console.error('Payment Details:',err.response.data)
      seter(err.response.data)
  }
}

export async function getDetails({ seter }){
  try{
      const res = await api.get("/doctor/profile/details")
      seter(res.data.records)
  }catch(err){
      console.error('Doctor Details:',err)
  }
}

// logged in user details
export const fetchMyProfile = async () => {
  const response = await api.get('/auth/doctor/identify'); 
  return response.data.data;
};


// update password
export async function updateUserPassword(data) {
  try {
    const response = await api.put(`/auth/user/update-password`, data);
    return response.data;  
  } catch (error) {
    console.error("Update Password error:", error);
    throw error;
  }
}

// updateUserProfile
export async function updateUserProfile(profile, onProgress = null) {
  try {
    const formData = new FormData();
    if (profile) formData.append("profile", profile);

    // const response = await api.put(`/auth/me/update-profile`, data);
    const response = await api.put("/auth/user/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent)
        },
    });
    return response.data;  
  } catch (error) {
    console.error("Update Profile error:", error);
    throw error;
  }
}

// update password
export async function updateDoctorTiming(data) {
  try {
    const response = await api.put(`/doctor/profile/update-timing`, data);
    return response.data;  
  } catch (error) {
    console.error("Update Timing error:", error);
    throw error;
  }
}

export async function addSpecialization(data) {
  try {
    const response = await api.post(`/doctor/profile/specialization`, data);
    return response.data;  
  } catch (error) {
    console.error("Add specialization error:", error);
    throw error;
  }
}

export async function deleteSpecialization(id) {
  try {
    const response = await api.delete(`/doctor/profile/specialization/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete specialization error:", error);
    throw error;
  }
}


export async function addAddress(data) {
  try {
    const response = await api.post(`/doctor/profile/address`, data);
    return response.data;  
  } catch (error) {
    console.error("Add specialization error:", error);
    throw error;
  }
}

export async function deleteAddress(id) {
  try {
    const response = await api.delete(`/doctor/profile/address/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete address error:", error);
    throw error;
  }
}