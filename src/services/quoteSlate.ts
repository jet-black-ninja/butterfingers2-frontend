import { QuoteLengthType } from '@/types';

const apiURL = 'https://quoteslate.vercel.app';

type QuoteType = {
  author: string;
  authorSlug: string;
  content: string;
  dateAdded: string;
  dateModified: string;
  length: number;
  tags: string[];
  _id: string;
  statusCode: number;
};
export async function getRandomQuoteByLength(
  length: QuoteLengthType,
  tags?: string[],
  abortController?: AbortController | null
) {
  const response = await fetch(
    `${apiURL}/api/quotes/random${length === 'short' ? '?maxLength=100' : length === 'medium' ? '?minLength=101&maxLength=250' : length === 'long' ? '?minLength=251' : ''}${tags?.length ? '&tags=' + tags.join(',') : ''}`,
    {
      method: 'get',
      signal: abortController?.signal,
    }
  );
  return (await response.json()) as QuoteType;
}

export async function getQuoteTagList() {
  const response = await fetch(`${apiURL}/api/tags`);

  return await response.json();
}
