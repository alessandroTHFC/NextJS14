import { getTokenWorkAround } from "../actions/AuthActions";

// Base URL for the API endpoints
const baseUrl = 'http://localhost:6001/';

// Function to make an HTTP GET request
// First we define our request options, we then send the Get request.
// From there we then pass the response in the handling function
async function get(url: string) {
    const requestOptions = {
        method: 'GET',
        headers: await getHeaders()
    }
    const response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

async function post(url: string, body: {}) {
    const requestOptions = {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    const response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

async function put(url: string, body: {}) {
    const requestOptions = {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    const response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

async function del(url: string) {
    const requestOptions = {
        method: 'DELETE',
        headers: await getHeaders(),
    }
    const response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

async function getHeaders() {
    const token = await getTokenWorkAround();
    const headers = {'Content-type': 'application/json'} as any
    if (token) {
        headers.Authorization = 'Bearer ' + token.access_token
    }
    return headers
}

// Function to handle the response from the server
// First we read the response body as text and then parse the text as JSON if possible.
// If the response is successful we will return the parsed data or status text if data not available
async function handleResponse(response: Response) {
    const text = await response.text();
    console.log("This is Text: ", text)

    const data = text && JSON.parse(text);
    console.log("This is Data: ", data)

    if (response.ok) {
        return data || response.statusText;
    } else {
        const error = {
            status: response.status,
            message: response.statusText
        }
        return {error};
    }
}

export const fetchWrapper = {
    get, post, put, del
}