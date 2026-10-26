# Plan de producto e implementación · 26 octubre 2026

## 1. Arquitectura de información

La pregunta principal es “¿qué sigue y adónde voy?”. Inicio prioriza actividad, asientos y acceso. Mi fin de semana organiza por día. En pista muestra la sesión real con explicaciones. Pilotos permite reconocer y seguir a un favorito. Mapa reúne rutas y reencuentro. Guía contiene preparación y educación.

## 2. Sitemap

`/` con secciones enlazables mediante `#inicio`, `#fin-de-semana`, `#live`, `#pilotos`, `#mapa`, `#guia`. Los fragmentos evitan depender de seis páginas descargadas para navegar offline. Diálogos accesibles de ajustes y asientos. API: `/api/timing`, `/api/grid`, `/api/weather`. Manifest y service worker en la raíz.

## 3. Flujos

1. Abrir → próxima actividad → elegir día → ver acceso → abrir indicaciones.
2. Configurar asientos → importar archivo privado → recuperar los tres boletos sin conexión.
3. Separación → consultar punto acordado → compartir texto compacto por WhatsApp; ubicación puntual opcional.
4. Elegir favorito → live timing → filtro favorito → leer distancias y explicación de cambios.
5. Preparar día → checklist y notas → cerrar → recuperar al volver.

## 4. Diseño

Base móvil de fondo claro, tipografía de sistema, navegación inferior de seis destinos, tarjetas grandes y foco visible. Verde profundo para jerarquía, azul para ubicación y amarillo para advertencias. Los estados siempre tienen texto. Tres temas utilizables: Paddock claro, México de fiesta y Centro de carrera. El diseño final se decide después de validar los flujos.

## 5. Modelo

`Activity`: ID estable, día, inicio/fin ISO con zona CDMX, categoría y explicación.
`Ticket`: día, sección, fila, asientos; solo local.
`Preferences`: tickets, notas por día, checklist por día, favorito, reunión, contraste, lectura y tema.
`Timing`: metadata, sesión, estado, filas normalizadas y mensajes originales.
`TimingRow`: número, piloto, equipo, posición, cambio, vuelta, mejor/último tiempo, diferencias, neumático, pits y fecha del dato.
`Provenance`: origen, URL, fecha, confianza y estado de frescura.
`Driver/Grid`: participantes, clasificación y metadata. `Weather`: estimación actual, pronóstico y metadata.

## 6. Fuentes

Prioridad a F1, MéxicoGP y FIA para información oficial. OpenF1 y Jolpica son fuentes alternativas explícitas. Open-Meteo para pronóstico modelado. Snapshots editoriales versionados; ausencia se representa como pendiente, nunca cero inventado.

## 7. Tiempo real

Polling de 30 s desde cliente visible y conectado a Route Handler Vercel. OpenF1 solo desde servidor. Sesiones restringidas por año y país. Normalización y validación de esquemas; fecha de actualización del registro, no del render. Demo opcional y separada. Mensajes originales de Race Control sin reinterpretarlos como decisiones oficiales propias.

## 8. Caché

Next Data Cache y CDN para reducir llamadas. 30 s timing, 5 min sesiones, 15 min clasificación, 10 min clima. Reintentos progresivos hasta 5 minutos. Tokens con expiración y sin exposición. Shell y assets precargados por service worker; último dato válido local. Los usuarios reciben fecha y advertencias offline.

## 9. Componentes

Companion, DayPicker, TicketCard, TicketForm, Checklist, TimingPanel, Heading, Source, Notice, External, CircuitArt. Hooks separados para preferencias y datos remotos. Error boundary, carga y 404.

## 10. Riesgos

Cuota de OpenF1 y conectividad; datos fuera de orden o nulos; carreras retrasadas; discrepancia sábado Puerta 2 vs información genérica; coordenadas interiores no confirmadas; mapas externos sin conexión; protección Vercel para familiares; caché obsoleta; actualización de reglas. Se muestran límites, fuente y fecha. Datos personales excluidos del repo.

## 11. Fases de hoy

Base y arquitectura → agenda/boletos/notas → proveedores → interfaz móvil → PWA → pruebas de datos y navegador → PR y preview Vercel → revisión de estilo visual y activación de credenciales.

## 12. Criterios

- Agenda de 22 actividades en hora CDMX, sin trasladar la carrera al 2 de noviembre en otras zonas.
- Asientos de los tres días recuperables en el teléfono y ausentes del código público.
- Advertencia sábado siempre visible junto al boleto.
- Campos faltantes, históricos y demo inequívocos.
- Favorito, checklist y notas sobreviven recarga.
- Los seis destinos abren sin red tras preparar la PWA.
- Conservar datos ante error, backoff y ninguna credencial en el navegador.
- Controles con nombres, foco visible, diálogo con cierre, navegación por teclado, reducción de movimiento y texto ampliable.
- Pruebas de normalización y proveedores aprobadas; build de producción validado.
- Preview inspeccionado; limitaciones y activaciones pendientes documentadas.
