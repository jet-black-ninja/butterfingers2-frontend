import { data } from '@/data';
import axios from 'axios';
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
) {
  try {
    const body = JSON.stringify(
      args.logInWith == 'email'
        ? { email: args.email, password: args.password }
        : { username: args.username, password: args.password }
    );
    const res = await axios.post(`${data.apiUrl}/auth/login`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      signal: abortController?.signal,
    });
    if (res.status === 402) throw new Error(res.data.message);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function LogOut() {
  const res = await axios.post(`${data.apiUrl}/auth/logout`, {
    withCredentials: true,
  });
  return res.data;
}
export async function ChangeUsername(newUsername: string, password: string) {
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
export async function ChangePassword(newPassword: string, oldPassword: string) {
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