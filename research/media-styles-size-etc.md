# Resumen Ejecutivo
- Preparar un paquete base de imágenes y videos por proyecto: versiones horizontales (desktop) y verticales (móvil) para redes y documento README.  
- Usar relaciones de aspecto clave: **16:9** (p. ej. 1920×1080), **9:16** (1080×1920), **1:1** (1080×1080) y **4:5** (1080×1350) según la plataforma. 
- Elegir formatos adecuados: **PNG** para interfaces/UI (sin pérdida), **JPG** para fotos/fondos, **GIF** para animaciones cortas (sin audio), **MP4** (H.264/AAC) para demos extensas. 
- Dirección de Alan para media animada: **un solo fotograma inicial con composición de thumbnail**, legible por sí mismo; después empieza la animación. No crear una secuencia de introducción ni inferir una duración de pausa.  
- Mantener accesibilidad: texto alternativo (`alt`), subtítulos, alto contraste, fuentes legibles y evitar dependencias de color.  
- Organizar **media kit** y nombres de archivos de forma consistente (ver árbol de archivos abajo).  
- Flujo recomendado: grabar una “master” limpia y luego derivar capturas 16:9/9:16, videos, GIF, thumbnails y social preview de allí.  

## 1. Assets base por proyecto
- Imágenes: capturas de pantalla (desktop/mobile), thumbnails horizontales y verticales, social preview (GitHub), capturas destacadas.  
- Videos: demos en **16:9** (desktop) y **9:16** (mobile/Reels) en MP4 H.264, GIF corto (~800–1200px ancho) para README.  
- Organizar en carpetas:  
  ```
  media/
  ├── social/
  │   ├── github-preview.png
  │   ├── square.png (p.ej. 1080×1080)
  │   └── vertical.png (1080×1920)
  ├── screenshots/
  │   ├── home-desktop-1920x1080.png
  │   ├── home-mobile-1080x1920.png
  │   └── feature1-desktop-1920x1080.png
  ├── demos/
  │   ├── demo-horizontal.mp4 (1920×1080)
  │   ├── demo-vertical.mp4 (1080×1920)
  │   └── demo-readme.gif (p.ej. 800×450)
  └── thumbnails/
      ├── thumbnail-horizontal.png
      └── thumbnail-vertical.png
  ```  

## 2. Ratios y resoluciones clave

| Aspect Ratio | Resolución sugerida | Uso principal                           |
|-------------|--------------------:|----------------------------------------|
| **16:9**    | 1920 × 1080 (HD)    | Desktop, YouTube, demos horizontales    
| **9:16**    | 1080 × 1920         | Móvil full-screen (Reels, Shorts, TikTok)  
| **1:1**     | 1080 × 1080         | Posts sociales cuadrados (Instagram, LinkedIn)  
| **4:5**     | 1080 × 1350         | Posts móviles (Instagram feed vertical)  
| **2:1**     | 1280 × 640          | GitHub **Social Preview** (2:1)  

*Nota: GitHub recomienda un mínimo 640×320 pero **1280×640** para mejor calidad. YouTube sugiere thumbnails 1280×720 (16:9). Instagram Reels/TikTok usan vertical 1080×1920.*  

## 3. Formatos de archivo (png/jpg/webp/gif/mp4)
- **PNG**: Ideal para UI, interfaces, screenshots con texto y transparencias. Sin pérdida y calidad máxima (código nítido). Usar PNG para capturas de UI y miniaturas con texto.  
- **JPG**: Útil para fotografías, fondos y gradientes complejos. Comprime pesadamente; **evítalo** si hay texto pequeño (se degrada). Evitar JPG para pantallas de código o dashboards.  
- **WebP**: Formato moderno con buena relación calidad-peso (ideal para web o portafolios online). No es universal en todas las plataformas sociales, pero es excelente para sitios propios.  
- **GIF**: Para demos muy cortas (*loops*). Sin audio, limitado a 256 colores por fotograma. Recomendaciones: 5–15 segundos, 10–15 FPS, ~800–1200 px de ancho. Para GIF de README, ir a lo breve (no usar GIF >20 MB). Si el GIF pesa mucho, usar MP4.  
- **MP4 (H.264 + AAC)**: Formato por defecto para videos. Par\u00e1metros típicos:  
  ```bash
  ffmpeg -i input.mov -vf "scale=1920:-1,fps=30" \
         -c:v libx264 -crf 22 -preset slow \
         -c:a aac -b:a 128k \
         -movflags +faststart \
         output.mp4
  ```  
  - Para video vertical, cambiar a `scale=1080:-1` (1080×1920). Mantener ~30 FPS para UI; 60 FPS solo si el movimiento lo justifica. Insertar `-pix_fmt yuv420p` si se requiere compatibilidad extra. El flag `+faststart` facilita la reproducción en web.  

## 4. Primer cuadro / Thumbnail
**Dirección para la media comunicada por Alan:** dejar **un solo frame al principio, estilo thumbnail**. Debe funcionar como imagen inicial autónoma y legible (nombre, logo suministrado o UI clara cuando corresponda), sin estar a mitad de una transición. El movimiento comienza después de ese frame; no añadir varios cuadros de portada ni asumir un tiempo de espera que Alan no especificó.

El thumbnail o poster externo puede prepararse por separado si el formato lo requiere; no sustituye ese único cuadro inicial. Mantener el texto mínimo y correcto. En GIFs, evitar cursores o movimientos incompletos en ese primer cuadro y comprobar que el bucle vuelve a él sin salto visual innecesario.  

## 5. Capturas de pantalla profesionales
- Preparar la app antes de capturar: eliminar datos sensibles, errores de consola, extensiones o barras irrelevantes, y terminar animaciones.  
- Mantener **scroll** consistente (por ejemplo, todos al top o en mismo punto de contenido) y zoom uniforme. Cursor **fuera** de elementos clave (o deshabilítalo si es posible).  
- No uses zoom brutal en la captura original (no capturar imagen gigante para luego redimensionar): el texto debe quedar nítido.  
- Para móvil, captura desde un dispositivo/resolución móvil real; no recortes de desktop. Ajusta orientación y considera el notch/barras.  

## 6. Presentación de screenshots
- No publiques la captura cruda sin formato. Añade un fondo con padding:  
  ```
  ┌───────────────┐
  │               │
  │ [ Screenshoot ] 
  │               │
  └───────────────┘
  ```  
- Buenas prácticas: padding generoso, fondo simple (gris claro, degradado sutil, etc.), bordes suaves (*border-radius*), y sombras suaves para elevar el panel. El contenido de la app debe ser protagonista: evita decoraciones distractoras.  

## 7. Grabación de demos
- Planifica **exactamente** qué mostrar: pasos claros sin contingencia. Antes de grabar, limpia la UI y prepara datos reales. Posiciona el scroll/estado inicial consistentemente.  
- Ruta del cursor decidida: clics directos, sin pausas largas o movimientos erráticos. Cierra notificaciones y fija resolución (p. ej., 1080p) para consistencia.  
- Secuencia efectiva:  
  1. Estado inicial claro.  
  2. Acción / click.  
  3. Resultado/apertura.  
  4. (Opcional: más acciones y resultados).  
  5. Final anunciando fin.  
- **No** mostrar errores humanos: edita (o graba de nuevo) si pausas o clics equivocan distraen. El ritmo ideal es “acción→resultado” continuo.  

## 8. Cursor
- El cursor debe verse **intencional**: movimientos suaves, cortos, hacia el objetivo correcto, con breve pausa antes de clicar.  
- Evita trazos largos u oscilaciones; no dejes el cursor estático sobre el elemento clave (ocúltalo tras un clic).  
- Después del clic, desvía el cursor de la zona de interés (por ejemplo, a un borde) para que no distraiga.  

## 9. Ritmo
- En demos promocionales, el ritmo *rápido* suele ser mejor que realista. Elimina esperas innecesarias: edita duplicaciones de scroll/lento, tiempo muerto, o búsquedas en pantalla.  
- Objetivo: **acción → resultado** sin pausas muertas. Ejemplo: clic seguido de carga, sin segundos extras antes de desplazarse.  

## 10. Duraciones típicas
- GIF para README: **5–15 s**. Breve loop sin audio.  
- Videos para redes (Reels/Shorts): **10–30 s** (verticales).  
- Demos rápidas: **15–45 s**. Muestran flujo clave.  
- Walkthrough/tutorial: **30–90+ s** (horizontal).  
- No intentes cubrir toda la app en un clip corto: enfócate en funciones clave.  

## 11. Composición vertical ≠ recortar horizontal
- **Nunca** uses el mismo video horizontal de desktop y recortes un pedazo para móvil. El interfaz quedaría diminuta o cortada.  
- Diseña un encuadre **vertical** específico: por ejemplo, centrar el elemento clave en una columna de 1080×1920 y añadir contenido/texto arriba/abajo.  
- Deja los bordes limpios: en TikTok/Reels, los controles (nombre, iconos) ocupan ~120 px de cada lado, 240 px arriba, 660 px abajo. No pongas texto o botones importantes en esas zonas.  

## 12. Contenido horizontal (Desktop/16:9)
- Resolución típica: **1920 × 1080 (16:9)**. Se reutiliza fácil para YouTube, GitHub, docs, portafolio, LinkedIn, etc.  
- En videos horizontales, el ancho de 1920 garantiza buena calidad; 30 FPS es suficiente para UI.  

## 13. Contenido vertical (Móvil/9:16)
- Resolución típica: **1080 × 1920 (9:16)**. Usado para Reels, Shorts, TikTok, Stories.  
- En videos verticales, deja márgenes de seguridad: texto e íconos clave al menos 120 px alejados de los costados, 240 px del tope (para no taparse con el nombre de usuario) y 660 px de la base (ver [TikTok Safe Zone][43]).  
- Mantén las pantallas legibles: si la UI es de escritorio, considera diseñar una interfaz específica para móvil o hacer zoom inteligente.  

## 14. Exportación de video – preset recomendado
Ejemplo general (horizontal 16:9):  
```bash
ffmpeg -i input.mov \
  -vf "scale=1920:-1,fps=30" \
  -c:v libx264 -crf 22 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4
```  
- Para vertical, cambiar a `scale=1080:-1` (mantiene 9:16).  
- Mantén el perfil de color sRGB (p. ej. `-vf "scale=1920:-1:flags=lanczos"`).  
- **CRF 20–23** da buen balance calidad/peso. `-preset fast` o `-preset slow` ajustan velocidad de compresión.  
- Audio: AAC 128 kbps suele bastar. Omitir audio en demos UI.  

## 15. Pipeline de GIF (ffmpeg)
Para convertir un video a GIF optimizado:  
1. Extraer paleta con `palettegen`.  
2. Aplicar paleta con `paletteuse`.  

```bash
ffmpeg -i demo.mp4 -vf "fps=12,scale=800:-1:flags=lanczos,palettegen" palette.png
ffmpeg -i demo.mp4 -i palette.png \
  -filter_complex "fps=12,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse" demo.gif
```  
- `fps=10-15`: frames por segundo reducidos.  
- `scale=800:-1`: ancho fijo (~800px) para un peso razonable.  
- El filtro `[x][1:v]paletteuse` aplica la paleta generada.  
- Estos pasos producen GIFs de mejor calidad y tamaño menor que un GIF exportado directamente.  

```mermaid
flowchart LR
    A[Video fuente] --> B{Filtro fps/escala}
    B --> C[palettegen (paleta 256 colores)]
    C --> D[paletteuse (aplica paleta)]
    D --> E[Archivo GIF optimizado]
```

## 16. README.md visual layout
Sugerencia de secciones y orden visual en el README:  
1. Nombre y descripción breve del proyecto.  
2. **Demo/Hero** (imagen o GIF/MP4 destacado).  
3. Principales características.  
4. Screenshots (desktop y móvil).  
5. Instrucciones de instalación.  
6. Uso o ejemplos.  
7. Tecnologías usadas.  
- Evitar enterrar el demo demasiado abajo. El lector debe entender rápido *qué es + qué hace + cómo se ve*.  

## 17. GitHub Social Preview
- Crear imagen dedicada para la previsualización social. Tamaño base: **1280 × 640 (2:1)**.  
- Diseñar con: nombre del proyecto, tagline o proposición de valor corta, y logo. Ejemplo:  
  ```
  ┌────────────────────────────────┐
  │                                │
  │  PROYECTO XYZ                  │
  │  Dashboard de gestión de datos │
  │                 [LOGO]         │
  │                                │
  └────────────────────────────────┘
  ```  
- No intentes mostrar toda la app en miniatura. Usa texto mínimo y limpio para identificación rápida.  

## 18. Texto en thumbnails
- Poca cantidad de texto. En miniaturas, menos es más: solo el nombre/proyecto + frase breve (p. ej. “App de chat en tiempo real”). .  
- *Mal ejemplo:* Recuadros con párrafos. *Buen ejemplo:* “DEVTRACK – Dashboard de productividad” (logo + tagline corto).  

## 19. Naming de archivos
- Nombres descriptivos y consistentes. Ejemplos:  
  ```
  dashboard-desktop-1920x1080.png
  login-mobile-1080x1920.png
  demo-desktop-16x9.mp4
  demo-mobile-9x16.mp4
  github-preview-1280x640.png
  ```  
- Evitar nombres genéricos o confusos: “image.png”, “final2.png”, “new-mv-16-9.gif”, etc.  

## 20. Accesibilidad
- Siempre incluir **texto alternativo (alt)** en imágenes.  
- Para videos/GIFs, ofrece **subtítulos** o descripciones de audio si contienen información relevante.  
- Asegurar **contraste** suficiente (texto vs fondo). No depender solo del color para transmitir información.  
- Texto legible (tamaño adecuado) y evitar parpadeos/animaciones rápidas.  
- Un usuario debe entender la demo **sin audio**: destaca visualmente qué sucede.  

## 21. Workflow recomendado (Mermaid)
Registrar primero una “master” de alta calidad con todas las acciones, luego derivar los assets:  

```mermaid
gantt
    title Flujo de trabajo de assets
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m
    section Captura
    Sesión maestra            :a1, 2026-09-27, 1d
    Captura Desktop           :after a1, 1d
    Captura Mobile            :after a1, 1d
    section Edición/Export
    Video 16:9 (Desktop)      :after a1, 1d
    Video 9:16 (Mobile)       :after a1, 1d
    GIF para README           :after a1, 0.5d
    Thumbnails                :after a1, 0.5d
    Social Preview GitHub     :after a1, 0.5d
```  

## 22. Regla de oro de enfoque
Cada asset debe responder **una sola pregunta visual**:
- ¿Qué es? (logo/título descriptivo)  
- ¿Cómo se ve? (captura o mockup del UI)  
- ¿Cómo funciona? (animación de la interacción)  
- ¿Qué funcionalidad destacas? (gráficos o puntos claves).  

No intentes responder todas las preguntas en una sola imagen o video.  

## Fuentes
- GitHub Docs (Social Preview)  
- YouTube (thumbnails 1280×720 recomendado)  
- Hootsuite (Instagram/TikTok specs)  
- Outfeed AI (TikTok 9:16 video)  
- Hootsuite (formatos JPG/PNG)