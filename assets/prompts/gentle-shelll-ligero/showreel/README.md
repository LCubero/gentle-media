# Showreel de Gentle Shell: un prompt, 44 segundos

**Un solo paso para comenzar:** adjunta a otra IA los cuatro archivos de imagen indicados abajo y pega **todo** [`prompt.md`](prompt.md) como un único mensaje. Pídele el HTML completo y descárgalo como `gentle-shell.html` en esta carpeta. No necesitas adjuntar los dos HTML de referencia: su apertura/cierre y la composición dinámica del centro ya están descritos en el prompt.

| Adjuntar (rutas relativas a este README) | Uso |
| --- | --- |
| `../assets/gentle-shell-banner-keyframe.png` | Logo real; incrustarlo sin alterarlo. |
| `../assets/gentle-shell.png` | Referencia visual de consola, no píxeles de salida. |
| `../assets/changes-view.png` | Referencia de cambios, no píxeles de salida. |
| `../assets/agents-view.png` | Referencia de hilos, no píxeles de salida. |

Las capturas nuevas `xc.png`, `ws.png` y `sad.png` del directorio privado Downloads son **opcionales**: si decides adjuntarlas, sirven solo para orientar la composición; no copies ni publiques sus píxeles, rutas, conversaciones, valores o texto. Las cuatro imágenes del kit ya bastan. No se genera ni incluye aquí un HTML final.

## Revisar y producir voz

Abre `gentle-shell.html` sin conexión y revisa 16x9 y 9x16, cuadro inicial, recomposición de escenas y retorno del agente, cierre a 44 s, legibilidad y subtítulos fuera del canvas. La inspección visual/escucha **requiere** generar primero ese HTML y audio reales; este kit no acredita una prueba en navegador. Si hay que corregirlo, continúa con la **misma IA y el mismo prompt**, sin duplicar el kit.

Si el HTML incluye una mezcla real de 44 s con la voz correcta, puedes usarla. Si no, usa [`elevenlabs.md`](elevenlabs.md) para generar nueve MP3 ingleses `voice/01.mp3` … `voice/09.mp3`; escucha que cada uno termine dentro de su ventana. El exportador prioriza estos archivos cuando existen. Sin ellos ni mezcla incrustada, habrá silencio; no reutilices los once clips antiguos de 60 s. [`subtitles.en.srt`](subtitles.en.srt) y [`subtitles.es.srt`](subtitles.es.srt) son externos y acompañan el MP4, nunca van quemados en el canvas.

## Exportar solo después de revisar

Con Node, `ffmpeg`/`ffprobe`, Chrome o Edge y `puppeteer-core` ya disponibles en el entorno:

```bash
node export.mjs          # ambos formatos limpios
node export.mjs 9x16     # solo vertical
```

Entrega `out/gentle-shell-16x9-none.mp4` y `out/gentle-shell-9x16-none.mp4` más ambos SRT. Dimensiones esperadas: 1920×1080 y 1080×1920; 1320 cuadros por formato (44 × 30). El exportador usa `subs:'none'`, y rechaza variantes `en`/`es` quemadas. Si advierte que `draw()` no es determinista, corrige el HTML antes de usarlo. Ni la exportación real de esta versión ni la escucha se han ejecutado aquí; no publiques `out/` ni `voice/` sin revisar derechos y contenido. La vía [`../generative/`](../generative/README.md) permanece independiente.
