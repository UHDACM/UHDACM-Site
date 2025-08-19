import { objectToUrlParams } from "./tools";

export async function fetchAPI(path: string, params?: Record<string, any>) {
  const urlParams = params ? objectToUrlParams(params) : undefined;
  const url = `${process.env.STRAPI_URL}/${path}${urlParams ? `?${urlParams}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    }
  });
  if (!res.ok) {
    console.error(res);
    throw new Error(`Failed to fetch API: ${path}`);
  }
  const data = await res.json();
  return data;
}
