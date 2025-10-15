(function () {
  function openDialog(title) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.display = "flex";

    overlay.innerHTML = `
      <div class="dialog">
        <div class="dialog-head">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Try a prompt or use the mic</div>
          </div>
          <button class="close-btn">Close</button>
        </div>

        <div class="dialog-body">
          <div class="examples">
            <div class="chip">Hello, I'd like a 30-minute intro next week.</div>
            <div class="chip">Could you do Tuesday 2–4pm?</div>
            <div class="chip">Use alex@example.com for the invite.</div>
          </div>

          <div class="chat" id="dlg-chat">
            <div class="bubble">Hi — ask me about ${title.toLowerCase()}.</div>
          </div>

          <div class="input-wrap">
            <input id="dlg-input" placeholder="Type your message..." />
            <button class="mic" aria-pressed="false" title="Hold to talk">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 18v3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <button id="dlg-send" class="btn primary">Send</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = overlay.querySelector(".close-btn");
    close.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    const chat  = overlay.querySelector("#dlg-chat");
    const input = overlay.querySelector("#dlg-input");
    const send  = overlay.querySelector("#dlg-send");

    function appendMine(text) {
      const b = document.createElement("div");
      b.className = "bubble me";
      b.textContent = text;
      chat.appendChild(b);
      chat.scrollTop = chat.scrollHeight;
    }

    function submitMessage(text) {
      const t = (text ?? input.value).trim();
      if (!t) return;
      appendMine(t);
      input.value = "";
    }

    document.querySelectorAll(".examples .chip").forEach(c =>
      c.addEventListener("click", () => submitMessage(c.textContent))
    );
    send.addEventListener("click", () => submitMessage());

    Voice.attach(overlay.querySelector(".input-wrap"), {
      silenceMs: 3600,              // 3.6s of silence → auto-send
      onAutoSend: submitMessage     // auto-send handler
    });
  }

  // Example: attach to your orbit bot pills
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-open-dialog]");
    if (!target) return;
    e.preventDefault();
    openDialog(target.getAttribute("data-open-dialog"));
  });
})();
