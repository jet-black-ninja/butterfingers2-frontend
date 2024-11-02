import { QuoteLengthType } from '@/types';

const apiURL = import.meta.env.API_URL;

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
  tags: string[],
  abortController?: AbortController | null
) {
  const response = await fetch(
    `${apiURL}/random${tags?.length ? '?tags=' + tags.join('|') : ''}
        ${
          length === 'short'
            ? '?maxlength= 100'
            : length === 'medium'
              ? '?minLength = 101&maxLength=250'
              : length === 'long'
                ? 'minLength=251'
                : ''
        }`,
    {
      method: 'get',
      signal: abortController?.signal,
    }
  );
  return (await response.json()) as QuoteType;
}

export async function getQuoteTagList() {
    const response = await fetch(`${apiURL}/tags`);
    return await response.json();
}