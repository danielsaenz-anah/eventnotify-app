# Audit Baseline - EventNotify

## Baselines del proyecto

### Baseline conceptual inicial
Corresponde a la arquitectura inicial documentada en la Actividad 1.4 y en el parcial 1.
Se caracteriza por una relación directa entre EventManager y NotificationService, con alto acoplamiento y extensibilidad limitada.

### Baseline funcional v1.0
Corresponde a la primera versión estable del sistema implementado.
Incluye:
- EventNotifyFacade
- EventBus
- NotificationFactory
- NotificationStrategy
- AsyncDispatcher
- SSE
- UI básica de suscripción y publicación

### Baseline de auditoría v1.1
Corresponde a la versión fortalecida para el segundo parcial.
Incluye:
- panel de estadísticas
- endpoint /api/stats
- mejoras de retroalimentación visual
- documentación de auditoría
- trazabilidad reforzada