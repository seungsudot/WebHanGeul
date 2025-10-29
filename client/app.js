const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let messages = [
  { role: "system", content: "You are 한결, a friendly Korean friend. 자연스럽게 대화해줘." }
];

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage("user", input);
  userInput.value = "";
  messages.push({ role: "user", content: input });

  if (messages.length > 50) messages = messages.slice(-50);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    const reply = data.reply;

    addMessage("bot", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    addMessage("bot", "⚠️ 서버 연결에 문제가 있습니다.");
  }

  chatBody.scrollTop = chatBody.scrollHeight;
}

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}
