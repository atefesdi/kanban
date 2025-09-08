import axios from "axios";
import api from "./api";
import type { loginResponse } from "../components/types";

export const signInUser = async (email: string, password: string): Promise<loginResponse> => {
  try {
    const response = await api.post("/users/sign_in", {
      user: { email, password },
    });

    const token = response.data.token;
    if (token) {
      localStorage.setItem("jwt", token);
    }

    return response.data;
  } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
    console.error("Login failed:", err.response?.data || err.message);
  } else {
    console.error("Login failed:", err);
  }
  throw err;
  }
};
