const helper = new LlmChatModelHelper();
const model = {
  name: "demo-model",
  path: "mock-model-path",
  topK: 40,
  topP: 0.9,
  temperature: 0.7,
  llmSupportImage: false,
  instance: null,
};

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

function appendMessage(role, text) {
  const message = document.createElement("div");
  message.textContent = `${role === "user" ? "🧑 You" : "🤖 Bot"}: ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const question = input.value.trim();
  if (!question) return;
  appendMessage("user", question);
  input.value = "";

  await helper.runInference(
    model,
    question,
    (result, done) => {
      if (done) appendMessage("bot", result);
    },
    () => console.log("Cleaned up session")
  );
});

resetBtn.addEventListener("click", () => {
  helper.resetSession(model);
  chatBox.innerHTML = "";
});

helper.initialize(model, (err) => {
  if (err) console.error(err);
});
