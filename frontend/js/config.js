// config.js
// HTTPS, no trailing slash:
window.BACKEND_URL = "https://ai-agents-backend-pejo.onrender.com";
console.log("[cfg] BACKEND_URL =", window.BACKEND_URL);

// Central list of bot IDs
window.BOTS = {
  support: "support-qa-bot",
  appointment: "appointment-setter-bot",
  automation: "custom-automation",
  onprem: "onprem-chatbot"
};
