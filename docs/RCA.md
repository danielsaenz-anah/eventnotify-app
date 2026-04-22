# Root Cause Analysis (5 Whys) - EventNotify

## Problema detectado
Persistencia de lógica no utilizada en el frontend, específicamente código relacionado con un carrusel que ya no formaba parte de la interfaz final.

## 5 Whys

1. ¿Por qué existía lógica no utilizada en el frontend?
Porque se implementó un carrusel que después dejó de formar parte del diseño final.

2. ¿Por qué el carrusel dejó de usarse?
Porque la interfaz evolucionó hacia una estructura más limpia y el componente dejó de aportar valor real.

3. ¿Por qué no se eliminó inmediatamente?
Porque no existía una revisión formal de limpieza de código después de los cambios de diseño.

4. ¿Por qué no había una revisión de limpieza?
Porque el enfoque estaba más orientado a implementar funcionalidad y presentación que a depurar código residual.

5. ¿Por qué esto se volvió una desviación del proceso?
Porque generaba complejidad innecesaria, afectaba la claridad del frontend y reducía la mantenibilidad del sistema.

## Acción correctiva
Se eliminó la lógica del carrusel mediante un commit específico de limpieza del frontend, acompañado de una reorganización visual de la interfaz y una actualización del CHANGELOG.

## Resultado esperado
- frontend más claro y mantenible
- reducción de código innecesario
- mejor alineación entre interfaz y lógica implementada
- fortalecimiento del proceso de revisión y limpieza antes de cada release