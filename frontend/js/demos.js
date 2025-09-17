function sendMsg(){
  const msg = (dlgInput.value || '').trim();
  if (!msg || !current) return;

  bubble(dlgChat, msg, true);
  dlgInput.value = '';

  // Map frontend keys → backend bot IDs
  const botMap = {
    appointment: "appointment-setter-bot",
    support: "support-qa-bot",
    automation: "custom-automation",
    internal: "onprem-chatbot"
  };

  const botId = botMap[current];
  if (!botId) {
    bubble(dlgChat, "❌ Unknown bot mapping.");
    return;
  }

  postJSON(`${BACKEND}/chat`, { message: msg, bot: botId })
    .then(r => bubble(dlgChat, r.reply || '…'))
    .catch(() => bubble(dlgChat, 'Cannot reach backend.'));
}
