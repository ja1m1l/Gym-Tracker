import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;


async function getHeaders() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
    };
}


// GET
export async function apiGet(endpoint) {

    const headers = await getHeaders();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers
        }
    );

    return response.json();
}


// POST
export async function apiPost(endpoint, body) {

    const headers = await getHeaders();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }
    );

    return response.json();
}


// PUT
export async function apiPut(endpoint, body) {

    const headers = await getHeaders();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(body)
        }
    );

    return response.json();
}


// DELETE
export async function apiDelete(endpoint) {

    const headers = await getHeaders();

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "DELETE",
            headers
        }
    );

    return response.json();
}