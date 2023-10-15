import axios from 'axios';

const BASE_URL =  process.env.NEXT_PUBLIC_AUTH_URL

export async function getNonce(address: string) {
    const res = await axios.get(`${BASE_URL}/connect/nonce?address=${address}`, { timeout: 5000 });
    if (res?.data) {
        return res.data.nonce;
    }
    return null;
}

export async function performLogin(address: string, sig: string) {
    const res = await axios.post(`${BASE_URL}/connect/login`, { address, signature: sig });
    return res;
}

export async function register(address: string) {
    const res = await axios.post(`${BASE_URL}/connect/signup`, { address });
    if (res.status === 200 && res.data) {
        return res.data;
    }

    return null;
}