import axios from "axios";
import api from "./api";
import type { loginResponse } from "../components/types";


export const signInUser = async (email: string, password: string): Promise<loginResponse> => {
  try {
    const response = await api.post("/users/sign_in", {
      user: { email, password },
    });
    return response.data

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err?.response?.data);
    }else{
      throw new Error("Unexpected error occurred.");
    }
  }
};

export const signUpUser = async (email: string, password: string, name: string, passwordConfirmation:string): Promise<loginResponse> => {
  try {
    const response = await api.post("/users", {
      user: { email, password , name, password_confirmation: passwordConfirmation},
    });
    return response.data

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err?.response?.data);
    }else{
      throw new Error("Unexpected error occurred.");
    }
  }
};
