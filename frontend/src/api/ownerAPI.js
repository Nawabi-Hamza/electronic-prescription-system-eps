import api from "./axios";


export const fetchUsers = async ({ seter }) => {
  try {
    const response = await api.get('/owner/users'); // ✅ Correct endpoint
    return seter(response.data.records);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};

// fetchUsersDetails

export async function fetchUsersDetails({ user_id, seter }) {
  try {
    const response = await api.get(`/owner/users/${user_id}`);
    return seter(response.data.record);
  } catch (error) {
    console.error("fetchUserById error:", error.response?.data || error.message);
    throw error;
  }
}

// createUser

export async function createUser(data) {
  try {
    // if (!data.students_profile) throw "Please select a student profile";

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
            // return console.log(data)
    const { data: res } = await api.post("/owner/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res;
  } catch (err) {
    console.error("create dcotor error:", err?.response?.data?.message || err);
    throw err;
  }
}
