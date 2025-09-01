import api from "./api";

export interface loginResponse {
  user: {id: number, name: string, email: string,}
  message: string;
  token: string;
}

export const signInUser = async (email:string, password:string): Promise<loginResponse> => {

  const response = await api.post("/users/sign_in",{
    user : { email, password },
  })

  const token = response.data.token;
  console.log("token:", token);
  if (token) {
    localStorage.setItem("jwt", token);
  }
  return response.data;
}
