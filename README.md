# EventNotify

Sistema de notificaciones basado en eventos desarrollado en **Node.js + TypeScript + Express + SSE**.

Proyecto académico para la materia **Ingeniería de Software II** enfocado en:

- Refactorización orientada a objetos
- Aplicación de Patrones de Diseño
- Manejo de eventos en tiempo real (Soft Real-Time)

---

##  Descripción

EventNotify es una aplicación que permite:

1. Suscribir usuarios a distintos canales de notificación (Email, SMS, Push).
2. Publicar eventos (CREATED, UPDATED, CANCELLED).
3. Notificar automáticamente a todos los suscriptores.
4. Visualizar las notificaciones en tiempo real mediante **Server-Sent Events (SSE)**.

La arquitectura del sistema aplica múltiples patrones de diseño para reducir acoplamiento y mejorar escalabilidad.

---

## Arquitectura y Patrones Implementados

### Facade (Patrón Estructural)

Clase principal: `EventNotifyFacade`

**Responsabilidad:**
- Actúa como punto único de acceso al sistema.
- Coordina suscripciones, publicación de eventos y despacho de notificaciones.
- Oculta la complejidad interna (EventBus, Factory, Strategies).

**Beneficio:**
- Reduce acoplamiento entre la capa web y la lógica interna.
- Mejora mantenibilidad.

---

###  Observer (Patrón de Comportamiento)

Clases principales:
- `EventBus`
- `UserSubscriber`

**Responsabilidad:**
- Permite que múltiples suscriptores reaccionen automáticamente cuando se publica un evento.
- Desacopla el emisor del evento de los receptores.

**Beneficio:**
- Escalabilidad.
- Extensibilidad.
- Eliminación de dependencias directas entre módulos.

---

###  Strategy (Patrón de Comportamiento)

Clases principales:
- `EmailStrategy`
- `SmsStrategy`
- `PushStrategy`

**Responsabilidad:**
- Define distintos algoritmos de envío de notificaciones según el canal.
- Permite intercambiar comportamiento sin modificar el núcleo del sistema.

**Beneficio:**
- Cumple con el Principio Abierto/Cerrado (OCP).
- Elimina estructuras condicionales complejas (if/switch por canal).

---

###  Factory Method (Patrón Creacional)

Clase principal:
- `NotificationFactory`

**Responsabilidad:**
- Centraliza la creación de estrategias de notificación.
- Evita instanciaciones directas dispersas en el sistema.

**Beneficio:**
- Reduce acoplamiento.
- Facilita la extensión a nuevos canales.

---

##  Manejo de Tiempo Real

El sistema implementa:

- Publicación de eventos asincrónica
- Despacho de notificaciones mediante `setTimeout` (simulación de concurrencia)
- Envío en tiempo real al navegador mediante **Server-Sent Events (SSE)**

Además, se mide la **latencia (ms)** entre la creación del evento y el envío de la notificación.

Esto representa un modelo de **Soft Real-Time**, donde la respuesta rápida mejora la experiencia, pero no es crítica.

---

##  Estructura del Proyecto

```
eventnotify-app/
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── src/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Instalación y Ejecución

### Clonar el repositorio

```bash
git clone https://github.com/danielsaenz-anah/eventnotify-app.git
cd eventnotify-app
```

### Instalar dependencias

```bash
npm install
```

###  Ejecutar en modo desarrollo

```bash
npm run dev
```

### Abrir en el navegador

```
http://localhost:3000
```

---

##  Flujo de Uso

1. Suscribir uno o más usuarios.
2. Publicar un evento.
3. Observar cómo llegan notificaciones en tiempo real.
4. Ver la latencia registrada en cada notificación.

---

##  Contexto Académico

Proyecto desarrollado como parte de la entrega final del **Primer Parcial** en:

**Ingeniería de Software II**  
Universidad Anáhuac Mayab  

Enfoque principal:

- Refactorización
- Patrones de diseño
- Mejora de arquitectura
- Aplicación de conceptos de sistemas orientados a eventos

---

## Versión

Versión estable etiquetada como:

```
v1.0
```

---

##  Autores

- Daniel Saenz Villanueva  
- Jorge Flota  
- Isabella Medina  
- Kevin Pacho  
- Tomas Altamirano