const subscribeForm = document.getElementById("subscribeForm");
const publishForm = document.getElementById("publishForm");
const feed = document.getElementById("feed");
const sseStatus = document.getElementById("sseStatus");
const subsList = document.getElementById("subsList");
const refreshSubs = document.getElementById("refreshSubs");
const totalSubscribers = document.getElementById("totalSubscribers");
const lastEvent = document.getElementById("lastEvent");
const messageBox = document.getElementById("messageBox");

function addFeedItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  feed.prepend(li);
}

function showMessage(text) {
  messageBox.textContent = text;
  messageBox.classList.remove("hidden");

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 2500);
}

async function loadStats() {
  const res = await fetch("/api/stats");
  const data = await res.json();

  totalSubscribers.textContent = data.totalSubscribers ?? 0;

  if (data.lastEvent) {
    lastEvent.textContent = `${data.lastEvent.title} (${data.lastEvent.type})`;
  } else {
    lastEvent.textContent = "Sin eventos";
  }
}

async function loadSubscribers() {
  const res = await fetch("/api/subscribers");
  const data = await res.json();
  subsList.innerHTML = "";

  totalSubscribers.textContent = data.total ?? 0;

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
      showMessage("Usuario eliminado correctamente");
      await loadSubscribers();
      await loadStats();
    });
  });
}

refreshSubs.addEventListener("click", async () => {
  await loadSubscribers();
  await loadStats();
  showMessage("Lista actualizada");
});

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
    showMessage(data.error);
    return;
  }

  addFeedItem(`✅ Suscrito: ${data.subscriber.name} (${data.subscriber.channel})`);
  showMessage("Usuario suscrito correctamente");
  subscribeForm.reset();
  await loadSubscribers();
  await loadStats();
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
    showMessage(data.error);
    return;
  }

  addFeedItem(`📌 Evento publicado: "${data.event.title}" (${data.event.type})`);
  showMessage("Evento publicado correctamente");
  publishForm.reset();
  await loadStats();
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

// Cargar inicial
loadSubscribers();
loadStats();

// Carrusel informativo
const slides = Array.from(document.querySelectorAll(".slide"));
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const dotsContainer = document.getElementById("carouselDots");

let currentSlide = 0;

function renderCarousel() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${index === currentSlide ? "active" : ""}`;
      dot.addEventListener("click", () => {
        currentSlide = index;
        renderCarousel();
      });
      dotsContainer.appendChild(dot);
    });
  }
}

if (prevSlideBtn && nextSlideBtn && slides.length > 0) {
  prevSlideBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderCarousel();
  });

  nextSlideBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderCarousel();
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderCarousel();
  }, 5000);

  renderCarousel();
}