const subscribeForm = document.getElementById("subscribeForm");
const publishForm = document.getElementById("publishForm");
const feed = document.getElementById("feed");
const sseStatus = document.getElementById("sseStatus");
const subsList = document.getElementById("subsList");
const refreshSubs = document.getElementById("refreshSubs");

function addFeedItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  feed.prepend(li);
}

async function loadSubscribers() {
  const res = await fetch("/api/subscribers");
  const data = await res.json();
  subsList.innerHTML = "";
  for (const s of data.subscribers) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${s.name} — ${s.channel}</span>
      <button data-id="${s.id}">Quitar</button>`;
    subsList.appendChild(li);
  }

  subsList.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      await loadSubscribers();
    });
  });
}

refreshSubs.addEventListener("click", loadSubscribers);

subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("subName").value;
  const channel = document.getElementById("subChannel").value;

  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, channel })
  });

  const data = await res.json();
  if (data.error) {
    alert(data.error);
    return;
  }

  addFeedItem(`✅ Suscrito: ${data.subscriber.name} (${data.subscriber.channel})`);
  subscribeForm.reset();
  await loadSubscribers();
});

publishForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("eventTitle").value;
  const type = document.getElementById("eventType").value;

  const res = await fetch("/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, type })
  });

  const data = await res.json();
  if (data.error) {
    alert(data.error);
    return;
  }

  addFeedItem(`📌 Evento publicado: "${data.event.title}" (${data.event.type})`);
  publishForm.reset();
});

// SSE
const es = new EventSource("/events");

es.addEventListener("open", () => {
  sseStatus.textContent = "conectado";
});

es.addEventListener("error", () => {
  sseStatus.textContent = "desconectado";
});

es.addEventListener("hello", (evt) => {
  try {
    const msg = JSON.parse(evt.data);
    addFeedItem(`🟢 ${msg.message}`);
  } catch {}
});

es.addEventListener("notification", (evt) => {
  const n = JSON.parse(evt.data);
  addFeedItem(`${n.rendered} | latencia: ${n.latencyMs}ms`);
});

// Cargar lista inicial
loadSubscribers();