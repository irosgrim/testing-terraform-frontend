export let BACKEND_BASE_URL = "http://localhost:3000";
export let WS_BACKEND_URL = "ws://localhost:3000"

const urlApiKey = new URLSearchParams(window.location.search).get("api_key");
const API_KEY = urlApiKey ? `?api_key=${urlApiKey}` : "";

WS_BACKEND_URL = WS_BACKEND_URL + API_KEY;