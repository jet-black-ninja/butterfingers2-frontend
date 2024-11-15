import { data } from '@/data';
import axios, { AxiosError } from 'axios';
interface LoginResponse {
  // Add your expected response properties here
  token?: string;
  user?: any;
  message?: string;
}

// Define error response type
interface ErrorResponse {
  message: string;
  status?: number;
}
export async function OauthFinalSteps(
  platform: 'GitHub' | 'Google',
  username: string
) {
  try {
    const response = await axios.post(
      `${data.apiUrl}/auth/${platform}/final-steps`,
      username,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    if (!response.data) {
      throw new Error('Failed to get user data');
    }
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function CreateAccount(
  username: string,
  email: string,
  password: string,
  abortController?: AbortController
) {
  try {
    const res = await axios.post(
      `${data.apiUrl}/auth/create-account`,
      { username, email, password },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        signal: abortController?.signal,
      }
    );
    if (!(res.status === 200)) throw new Error(res.data.message);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function LogIn(
  args: (
    | { logInWith: 'username'; username: string }
    | { logInWith: 'email'; email: string }
  ) & {
    password: string;
  },
  abortController?: AbortController
): Promise<LoginResponse> {
  try {
    const body =
      args.logInWith === 'email'
        ? { email: args.email, password: args.password }
        : { username: args.username, password: args.password };
    console.log(body);
    const res = await axios.post(`${data.apiUrl}/auth/login`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      signal: abortController?.signal,
    });
    
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        // Server responded with an error
        const errorMessage =
          axiosError.response.data.message || 'An error occurred during login';
        throw new Error(errorMessage);
      } else if (axiosError.request) {
        // Request was made but no response received
        throw new Error(
          'No response received from server. Please check your connection.'
        );
      } else {
        // Error in setting up the request
        throw new Error('Failed to make login request: ' + axiosError.message);
      }
    }

    // Handle non-axios errors
    throw new Error('An unexpected error occurred');
  }
}

export async function LogOut() {
  const res = await axios.post(`${data.apiUrl}/auth/logout`, {
    withCredentials: true,
  });
  return res.data;
}
export async function httpChangeUsername(newUsername: string, password: string) {
  const res = await axios.post(
    `${data.apiUrl}/auth/change-username`,
    { newUsername, password },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  return res.data;
}
export async function httpChangePassword(newPassword: string, oldPassword: string) {
  const res = await axios.post(
    `${data.apiUrl}/auth/change-password`,
    { newPassword, oldPassword },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
  return res.data;
}
