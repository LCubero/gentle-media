# Gentle Shell — video de 60 s con modelo generativo (16:9 y 9:16)

Carpeta lista para generar el video con un modelo que produce imagen **y** audio en el mismo prompt (por ejemplo Astra 6). Cada `.txt` es un prompt completo: ábrelo, copia **todo** y pégalo tal cual.

## Qué hay aquí

```text
generative/
├── 16x9/            ← 12 prompts para horizontal (00 = thumbnail, 01–11 = clips)
├── 9x16/            ← los mismos 12 prompts recompuestos para vertical
├── out/16x9/        ← aquí guardas lo que genere el modelo (horizontal)
├── out/9x16/        ← aquí guardas lo que genere el modelo (vertical)
├── audio-60s.txt    ← (opcional) prompt de audio único de 60 s
├── titles.en.srt    ← títulos en pantalla; los pone el script
└── assemble.sh      ← une todo en el video final de 60 s exactos
```

Las imágenes de referencia están en `../assets/`.

## Paso a paso (haz primero 16x9 completo y luego repite con 9x16)

### 1. Thumbnail

- Pega `16x9/00-thumbnail.txt`.
- Adjunta `../assets/gentle-shell-banner-keyframe.png`.
- Guarda el resultado como **`out/16x9/thumb.png`**.

Es el frame 0 del video (un solo frame, como pide Alan) y el inicio del clip 1.

### 2. Los 11 clips

Genera uno por uno, en orden. Si el modelo pide duración, elige la más cercana **igual o mayor** a la de la tabla; el script recorta lo que sobre.

| Pega | Adjunta | Duración | Guarda como |
| --- | --- | --- | --- |
| `01-identify.txt` | `out/16x9/thumb.png` como **frame inicial** + `../assets/gentle-shell-banner-keyframe.png` | 5 s | `out/16x9/c01.mp4` |
| `02-lead.txt` | `../assets/gentle-shell.png` | 5 s | `out/16x9/c02.mp4` |
| `03-stay-oriented.txt` | `../assets/gentle-shell.png` | 5 s | `out/16x9/c03.mp4` |
| `04-small-work.txt` | — | 5 s | `out/16x9/c04.mp4` |
| `05-focused-help.txt` | `../assets/agents-view.png` | 6 s | `out/16x9/c05.mp4` |
| `06-inspect.txt` | `../assets/changes-view.png` | 6 s | `out/16x9/c06.mp4` |
| `07-honest-scope.txt` | `../assets/changes-view.png` | 6 s | `out/16x9/c07.mp4` |
| `08-context.txt` | `../assets/agents-view.png` | 6 s | `out/16x9/c08.mp4` |
| `09-responsibility.txt` | — | 7 s | `out/16x9/c09.mp4` |
| `10-resolve.txt` | `../assets/gentle-shell-banner-keyframe.png` | 5 s | `out/16x9/c10.mp4` |
| `11-hold.txt` | último frame de `c10` como **frame inicial** (o el keyframe) | 4 s | `out/16x9/c11.mp4` |

Si el modelo no acepta imágenes adjuntas, pega solo el texto.

### 3. Revisa cada clip antes de seguir

Regenera el clip si falla cualquiera de estos puntos:

- [ ] La voz dice **exactamente** la frase del prompt y termina antes del final.
- [ ] Suena como la misma voz de los clips anteriores.
- [ ] No aparece texto legible, salvo el logo.
- [ ] No aparecen versiones, nombres de modelos ni precios.
- [ ] No hay destellos ni parpadeos fuertes.

Si la voz cambia mucho entre clips, usa la opción del paso 5.

### 4. Arma el video

Desde la raíz del repositorio, en Git Bash (necesitas `ffmpeg` y `ffprobe`):

```bash
bash assets/prompts/gentle-shelll-ligero/generative/assemble.sh 16x9 en
```

- Sale en `out/16x9/gentle-shell-16x9-en.mp4`.
- Para subtítulos en español cambia `en` por `es`; para no poner subtítulos, usa `none`.
- La última línea debe decir `1920,1080,1800 (expected 1920,1080,1800)`.

### 5. (Opcional) Audio único de 60 s

Úsalo solo si la voz varía demasiado entre clips.

1. Pega `audio-60s.txt` en el modo de audio o texto-a-voz del modelo.
2. Guarda el resultado en `out/16x9/` (por ejemplo `out/16x9/audio.wav`).
3. Arma el video pasando ese archivo como tercer argumento; reemplaza el audio de todos los clips:

```bash
bash assets/prompts/gentle-shelll-ligero/generative/assemble.sh 16x9 en assets/prompts/gentle-shelll-ligero/generative/out/16x9/audio.wav
```

### 6. Repite con vertical

Haz los pasos 1–5 con la carpeta `9x16/`, guardando en `out/9x16/`. Luego:

```bash
bash assets/prompts/gentle-shelll-ligero/generative/assemble.sh 9x16 en
```

La última línea debe decir `1080,1920,1800 (expected 1080,1920,1800)`.

### 7. Revisión final

Mira cada video dos veces: una con sonido y otra en silencio, y en tamaño de escritorio y de celular. Comprueba que:

- [ ] El primer frame es el thumbnail.
- [ ] Los títulos y subtítulos no se cortan ni quedan detrás de los controles del celular.
- [ ] La voz no se pisa con el corte de cada clip.

## Por qué el texto no lo genera el modelo

Los modelos de video deforman las letras, y los screenshots de referencia muestran nombres de modelos y versiones (regla de Alan: no poner versiones). Por eso los prompts piden imagen sin texto, salvo el logo, y `assemble.sh` agrega los títulos y los subtítulos.

## Límites

- Los archivos de `out/` no se suben al repositorio (ver `out/.gitignore`).
- `assemble.sh` solo se probó con clips sintéticos. Los clips reales, la consistencia de la voz y la mezcla de audio están sin revisar.
- Antes de publicar, revisa los derechos de la voz generada y del uso del logo; ver [`../claims-and-assets.md`](../claims-and-assets.md).
