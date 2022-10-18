export let BACKEND_BASE_URL = "https://ioan-backend-service-jucwb6gsyq-ez.a.run.app";
export let WS_BACKEND_URL = "wss://ioan-backend-service-jucwb6gsyq-ez.a.run.app"

const urlApiKey = new URLSearchParams(window.location.search).get("api_key");
const API_KEY = urlApiKey ? `?api_key=${urlApiKey}` : "";

WS_BACKEND_URL = WS_BACKEND_URL + API_KEY;