import apiClient from "./client";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface APiData {
  token: string;
  user: UserData;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  status: boolean;
  statusCode: number;
  message: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const authApi = {
  login: async (params: LoginParams): Promise<ApiResponse<APiData>> => {
    return await apiClient.post("/admin/login", params);
  },
};
