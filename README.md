# EventNotify

Sistema de notificaciones basado en eventos desarrollado en Node.js + TypeScript + Express + Server-Sent Events (SSE).

Arquitectura orientada a eventos con aplicación de patrones de diseño y control de versiones para garantizar trazabilidad, escalabilidad y mantenibilidad.

---

## Descripción

EventNotify es una aplicación que permite:

1. Suscribir usuarios a distintos canales de notificación (Email, SMS, Push)
2. Publicar eventos (CREATED, UPDATED, CANCELLED)
3. Notificar automáticamente a todos los suscriptores
4. Visualizar las notificaciones en tiempo real mediante SSE
5. Consultar métricas del sistema en tiempo real (/api/stats)

---

## Arquitectura y Patrones Implementados

### Facade (Estructural)

Clase: EventNotifyFacade

- Punto único de acceso al sistema
- Orquesta la lógica de negocio
- Encapsula complejidad interna

Beneficio: desacoplamiento entre frontend y lógica interna.

---

### Observer (Comportamiento)

Clases:
- EventBus
- UserSubscriber

- Permite notificación automática a múltiples suscriptores
- Desacopla productor de consumidores

Beneficio: escalabilidad y extensibilidad.

---

### Strategy (Comportamiento)

Clases:
- EmailStrategy
- SmsStrategy
- PushStrategy

- Define diferentes formas de notificación
- Permite cambiar comportamiento dinámicamente

Beneficio: cumplimiento del principio Open/Closed.

---

### Factory Method (Creacional)

Clase:
- NotificationFactory

- Centraliza creación de estrategias
- Evita instanciación directa

Beneficio: reducción de acoplamiento.

---

## Manejo de Tiempo Real

- Eventos procesados de forma asincrónica
- Notificaciones enviadas con setTimeout (simulación concurrente)
- Comunicación en tiempo real vía SSE
- Medición de latencia por evento

Modelo implementado: Soft Real-Time

---

## Funcionalidades agregadas (v1.1 - v1.2)

- Panel de resumen del sistema
- Endpoint /api/stats para métricas
- Visualización de:
  - Total de suscriptores
  - Último evento
  - Estado SSE
- Mejora de interfaz de usuario
- Navegación superior y diseño más estructurado
- Feedback visual (mensajes dinámicos)
- Eliminación de lógica redundante en frontend
- Integración de documentación de auditoría (/docs)
- Implementación de CHANGELOG

---

## Estructura del Proyecto

eventnotify-app/
│
├── docs/
│   ├── AUDIT_BASELINE.md
│   ├── METRICS.md
│   └── RCA.md
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── src/
│   └── server.ts
│
├── CHANGELOG.md
├── package.json
├── tsconfig.json
└── README.md

---

## Instalación y Ejecución

Clonar repositorio:

git clone https://github.com/danielsaenz-anah/eventnotify-app.git  
cd eventnotify-app  

Instalar dependencias:

npm install  

Ejecutar en desarrollo:

npm run dev  

Acceder:

http://localhost:3000

---

## Flujo de Uso

1. Registrar usuarios en distintos canales
2. Publicar un evento
3. Observar notificaciones en tiempo real
4. Consultar métricas del sistema
5. Validar latencia por evento

---

## Versionado

El proyecto utiliza versionado mediante Git Tags y Releases:

- v1.0 → Implementación base del sistema
- v1.1 → Métricas, auditoría y trazabilidad
- v1.2 → Mejora visual, navegación y refinamiento del frontend

El historial de cambios detallado se encuentra en CHANGELOG.md

---

## Evidencia de Ingeniería de Software

El proyecto incluye:

- Control de versiones (Git)
- Trazabilidad de cambios (CHANGELOG)
- Métricas del sistema
- Análisis de causa raíz (RCA)
- Documentación de líneas base

Ubicación: /docs

---

## Autores

- Daniel Saenz Villanueva  
- Jorge Flota  
- Isabella Medina  
- Kevin Pacho  
- Tomas Altamirano  