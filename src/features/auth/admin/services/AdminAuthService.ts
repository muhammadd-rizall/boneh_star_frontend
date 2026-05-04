import api from "@/api/Axios";

export const adminAuthService = {
  login: async (credentials: any) => {
    const response = await api.post("/admin/auth/login", credentials);
    return response.data;
  },
};
