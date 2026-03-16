import axios from "axios";

export async function fetcher(url: string) {
  const res = await axios.get(url);
  return res.data;
}

export async function postFetcher(url: string, body: any) {
  const res = await axios.post(url, body);
  return res.data;
}

