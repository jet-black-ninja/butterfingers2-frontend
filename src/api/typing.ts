import { TypingResult } from '@/types';
import { data } from '@/data';
import axios from 'axios';

export async function TypingStarted() {
  const res = await fetch(data.apiUrl + '/typing/started', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(await res.json());
  }

  return res.json();
}
export async function TypingCompleted(result: TypingResult) {
  const transformedResult = { ...result };
  delete transformedResult.date;
  const res = await axios.post(
    `${data.apiUrl}/typing/completed`,
    transformedResult,
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
