import { ICustomize } from '@/contexts/profile.context';
import { data } from '@/data';
import axios from 'axios';
export type GetProfileFilterType = 'username' | 'customize' | 'stats';
export async function GetProfile() {
  const res = await axios.get(`${data.apiUrl}/profile`, {
    withCredentials: true,
  });
  return res.data;
}
export async function GetHistory(
  page: number = 1,
  limit: number = 10,
  abortController?: AbortController
) {
  const res = await axios.get(
    `${data.apiUrl}/profile/history?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
      signal: abortController?.signal,
    }
  );

  return res.data;
}
export async function PostCustomize(customize: Partial<ICustomize>) {
  const res = await axios.post(`${data.apiUrl}/profile/customize`, customize, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return res.data;
}
export async function httpClearHistory(password: string) {
  const res = await axios.post(
    `${data.apiUrl}/profile/history/clear`,
    { password },
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

export async function httpResetStats(password: string) {
  const res = await axios.post(
    `${data.apiUrl}/profile/reset-stats`,
    { password },
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
