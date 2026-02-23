import express from "express";
import type { Request, Response } from "express";
import * as path from "path";
/**
 * Dominio (DTOs)
 */
type ChannelType = "email" | "sms" | "push";

type DomainEvent = {
  id: string;
  title: string;
  type: "CREATED" | "UPDATED" | "CANCELLED";
  createdAt: number;
};

type NotificationMessage = {
  id: string;
  userId: string;
  userName: string;
  channel: ChannelType;
  eventId: string;
  eventTitle: string;
  eventType: DomainEvent["type"];
  sentAt: number;
  latencyMs: number;
  rendered: string; // texto listo para mostrar en UI
};

/**
 * Strategy (Comportamiento)
 */
interface NotificationStrategy {
  send(userName: string, event: DomainEvent): string; // retorna texto "enviado"
}

class EmailStrategy implements NotificationStrategy {
  send(userName: string, event: DomainEvent): string {
    return `📧 Email a ${userName}: Evento "${event.title}" (${event.type})`;
  }
}

class SmsStrategy implements NotificationStrategy {
  send(userName: string, event: DomainEvent): string {
    return `📱 SMS a ${userName}: Evento "${event.title}" (${event.type})`;
  }
}

class PushStrategy implements NotificationStrategy {
  send(userName: string, event: DomainEvent): string {
    return `🔔 Push a ${userName}: Evento "${event.title}" (${event.type})`;
  }
}

/**
 * Factory Method (Creacional)
 */
class NotificationFactory {
  static create(channel: ChannelType): NotificationStrategy {
    switch (channel) {
      case "email":
        return new EmailStrategy();
      case "sms":
        return new SmsStrategy();
      case "push":
        return new PushStrategy();
      default: {
        const exhaustive: never = channel;
        throw new Error(`Canal no soportado: ${exhaustive}`);
      }
    }
  }
}

/**
 * Observer (Comportamiento)
 */
type Subscriber = {
  id: string;
  name: string;
  channel: ChannelType;
};

interface Observer {
  update(event: DomainEvent): NotificationMessage;
}

class UserSubscriber implements Observer {
  constructor(private subscriber: Subscriber) {}

  update(event: DomainEvent): NotificationMessage {
    const strategy = NotificationFactory.create(this.subscriber.channel);
    const sentAt = Date.now();
    const rendered = strategy.send(this.subscriber.name, event);

    return {
      id: cryptoRandomId(),
      userId: this.subscriber.id,
      userName: this.subscriber.name,
      channel: this.subscriber.channel,
      eventId: event.id,
      eventTitle: event.title,
      eventType: event.type,
      sentAt,
      latencyMs: Math.max(0, sentAt - event.createdAt),
      rendered
    };
  }
}

class EventBus {
  private observers: Map<string, Observer> = new Map();

  subscribe(id: string, observer: Observer) {
    this.observers.set(id, observer);
  }

  unsubscribe(id: string) {
    this.observers.delete(id);
  }

  notifyAll(event: DomainEvent): NotificationMessage[] {
    const out: NotificationMessage[] = [];
    for (const obs of this.observers.values()) {
      out.push(obs.update(event));
    }
    return out;
  }

  count(): number {
    return this.observers.size;
  }
}

/**
 * Cola async (para "soft real-time" y desacoplar despacho)
 */
class AsyncDispatcher {
  dispatch(messages: NotificationMessage[], deliver: (m: NotificationMessage) => void) {
    for (const m of messages) {
      // Simula asincronía con microtarea + pequeño jitter
      const jitter = Math.floor(Math.random() * 120); // 0..119ms
      setTimeout(() => deliver(m), jitter);
    }
  }
}

/**
 * Facade (Estructural): punto único de acceso
 */
class EventNotifyFacade {
  private bus = new EventBus();
  private dispatcher = new AsyncDispatcher();

  private subscribers: Map<string, Subscriber> = new Map();

  // "Clientes SSE" conectados
  private sseClients: Set<Response> = new Set();

  addSseClient(res: Response) {
    this.sseClients.add(res);
  }

  removeSseClient(res: Response) {
    this.sseClients.delete(res);
  }

  private broadcast(msg: NotificationMessage) {
    const data = JSON.stringify(msg);
    for (const client of this.sseClients) {
      client.write(`event: notification\n`);
      client.write(`data: ${data}\n\n`);
    }
  }

  subscribeUser(name: string, channel: ChannelType): Subscriber {
    const sub: Subscriber = { id: cryptoRandomId(), name, channel };
    this.subscribers.set(sub.id, sub);
    this.bus.subscribe(sub.id, new UserSubscriber(sub));
    return sub;
  }

  unsubscribeUser(id: string) {
    this.subscribers.delete(id);
    this.bus.unsubscribe(id);
  }

  listSubscribers(): Subscriber[] {
    return Array.from(this.subscribers.values());
  }

  publishEvent(title: string, type: DomainEvent["type"]): DomainEvent {
    const event: DomainEvent = {
      id: cryptoRandomId(),
      title,
      type,
      createdAt: Date.now()
    };

    const messages = this.bus.notifyAll(event);
    this.dispatcher.dispatch(messages, (m) => this.broadcast(m));

    return event;
  }

  subscriberCount(): number {
    return this.bus.count();
  }
}

/**
 * Utilidad ID
 */
function cryptoRandomId(): string {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.randomUUID();
}

/**
 * Web server
 */
const app = express();
const PORT = 3000;
const facade = new EventNotifyFacade();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

/**
 * SSE endpoint
 */
app.get("/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  res.write(`event: hello\n`);
  res.write(`data: ${JSON.stringify({ ok: true, message: "SSE conectado" })}\n\n`);

  facade.addSseClient(res);

  req.on("close", () => {
    facade.removeSseClient(res);
    res.end();
  });
});

/**
 * API: suscribir
 */
app.post("/api/subscribe", (req: Request, res: Response) => {
  const { name, channel } = req.body as { name?: string; channel?: ChannelType };

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name es requerido" });
  }
  if (!channel || !["email", "sms", "push"].includes(channel)) {
    return res.status(400).json({ error: "channel inválido (email|sms|push)" });
  }

  const sub = facade.subscribeUser(name.trim(), channel);
  return res.json({ subscriber: sub, total: facade.subscriberCount() });
});

/**
 * API: desuscribir
 */
app.post("/api/unsubscribe", (req: Request, res: Response) => {
  const { id } = req.body as { id?: string };
  if (!id) return res.status(400).json({ error: "id es requerido" });

  facade.unsubscribeUser(id);
  return res.json({ ok: true, total: facade.subscriberCount() });
});

/**
 * API: listar suscriptores
 */
app.get("/api/subscribers", (_req: Request, res: Response) => {
  return res.json({ subscribers: facade.listSubscribers(), total: facade.subscriberCount() });
});

/**
 * API: publicar evento
 */
app.post("/api/publish", (req: Request, res: Response) => {
  const { title, type } = req.body as { title?: string; type?: DomainEvent["type"] };

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title es requerido" });
  }
  if (!type || !["CREATED", "UPDATED", "CANCELLED"].includes(type)) {
    return res.status(400).json({ error: "type inválido (CREATED|UPDATED|CANCELLED)" });
  }

  const event = facade.publishEvent(title.trim(), type);
  return res.json({ event, totalSubscribers: facade.subscriberCount() });
});

app.listen(PORT, () => {
  console.log(`EventNotify corriendo en http://localhost:${PORT}`);
});