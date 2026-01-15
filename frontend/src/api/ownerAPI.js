import api from "./axios";

export const fetchDashboard = async () => {
  try {
    const { data } = await api.get("/owner/dashboard");

    return data?.data; // return payload only
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Request failed";

    console.error("Error fetching dashboard:", message);
    throw new Error(message);
  }
};


export const fetchUsers = async ({ seter }) => {
  try {
    const response = await api.get('/owner/users'); // ✅ Correct endpoint
    return seter(response.data.records);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};

export const loadDoctorsPayments = async ({ seter, year, month }) => { 
  try {
    const res = await api.get("/owner/payments/filter", {
      params: { year, month }   // <-- send to backend
    });

    return seter(res.data.data || []);
  } catch (err) {
    console.log("Error loading payments:", err);
  }
};

export const loadDoctorsDidNotPayments = async ({ seter, year, month }) => { 
  try {
    const res = await api.get("/owner/payments/unpaid/filter", {
      params: { year, month }   // <-- send to backend
    });

    return seter(res.data.data || []);
  } catch (err) {
    console.log("Error loading payments:", err);
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

export async function deleteUser(user_id) {
  try {
    // if (!data.students_profile) throw "Please select a student profile";
    // return console.log(user_id)
            // return console.log(data)
    const res = await api.delete(`/owner/users/${user_id}`);
    console.log(res)

    return res;
  } catch (err) {
    console.error("create dcotor error:", err?.response?.data?.message || err);
    throw err;
  }
}


export async function updateUser(user_id, data) {
  try {
    if (!user_id) throw "Please select a user to update";
    const { data: res } = await api.put(`/owner/users/${user_id}`, data);
    return res;
  } catch (err) {
    console.error("create dcotor error:", err?.response?.data?.message || err);
    throw err;
  }
}