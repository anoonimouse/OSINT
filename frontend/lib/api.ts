import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher(path: string) {
  const res = await axios.get(`${API_BASE}${path}`);
  return res.data;
}

export async function postFetcher(path: string, body: any) {
  const res = await axios.post(`${API_BASE}${path}`, body);
  return res.data;
}

