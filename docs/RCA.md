# Root Cause Analysis (5 Whys) - EventNotify

## Problema detectado
Alta dependencia entre la gestión de eventos y el sistema de notificaciones en la arquitectura inicial.

## 5 Whys

1. ¿Por qué existía alta dependencia?
Porque el flujo de eventos llamaba directamente al módulo de notificaciones.

2. ¿Por qué llamaba directamente al módulo de notificaciones?
Porque el diseño inicial centralizaba la coordinación en un solo punto.

3. ¿Por qué se centralizó la coordinación?
Porque inicialmente se priorizó funcionalidad sobre separación de responsabilidades.

4. ¿Por qué eso se volvió una desviación?
Porque al agregar múltiples canales y requerimientos de escalabilidad, el diseño inicial ya no fue suficiente.

5. ¿Por qué fue necesario corregirlo?
Porque generaba deuda técnica, dificultaba extender el sistema y afectaba la claridad del flujo.

## Acción correctiva
Se aplicó una refactorización con Facade, Observer, Factory Method y Strategy.

## Resultado esperado
- menor acoplamiento,
- mayor extensibilidad,
- mejor claridad arquitectónica,
- mejor preparación para escenarios de tiempo real.