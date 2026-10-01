# Gentle Shell — video por piezas con Claude (60 s, 16:9 y 9:16)

Claude genera el video en 11 piezas cortas. Cada pieza es un HTML con su propia animación, su título y su audio. Revisas cada pieza en el navegador, la pasas a MP4 en tu PC, y al final se unen en un video de 60 s exactos por formato.

**Por qué HTML y no MP4 directo:** Claude web no entrega un MP4 con cuadros exactos. El HTML se exporta en tu PC con cuadros exactos, y si una pieza sale mal rehaces solo esa.

## Qué hay aquí

```text
generative/
├── prompts/          ← 11 prompts, uno por pieza (sirven para 16:9 y 9:16)
├── pieces/           ← aquí guardas cada HTML que te da Claude: 01.html … 11.html
├── voice/            ← (opcional) voces de ElevenLabs: 01.mp3 … 11.mp3
├── out/16x9/, out/9x16/  ← clips y video final (no se suben al repo)
├── export-piece.mjs  ← pasa una pieza (o todas) a MP4
└── assemble.sh       ← une las 11 piezas en el video final
```

## Paso a paso

### 1. Abre un solo chat de Claude para todo el video

Usa **el mismo chat** para las 11 piezas, así el estilo y la voz se mantienen. En el primer mensaje adjunta las 4 imágenes de `../assets/`:

- `gentle-shell-banner-keyframe.png` (el logo)
- `gentle-shell.png`
- `changes-view.png`
- `agents-view.png`

### 2. Genera cada pieza, en orden

Por cada pieza:

1. Abre el `.txt` de `prompts/`, copia **todo** y pégalo en el chat.
2. Descarga el HTML y guárdalo en `pieces/` con el número de la pieza: `01.html`, `02.html`…
3. Ábrelo en el navegador y revisa los dos formatos (botón 16x9 / 9x16).
4. Si algo está mal, pide el cambio en el mismo chat y vuelve a guardar el archivo con el mismo nombre.

| Pieza | Prompt | Duración | Qué dice la voz |
| --- | --- | --- | --- |
| 01 | `01-identify.txt` | 5 s | Gentle Shell. Built for Pi. |
| 02 | `02-lead.txt` | 5 s | One workspace. You lead the work. |
| 03 | `03-stay-oriented.txt` | 5 s | Keep your session and next steps in view. |
| 04 | `04-small-work.txt` | 5 s | Small work stays small. |
| 05 | `05-focused-help.txt` | 6 s | Focused help returns to the parent session. |
| 06 | `06-inspect.txt` | 6 s | Inspect captured write and edit changes. |
| 07 | `07-honest-scope.txt` | 6 s | A Changes view is not a full Git audit. |
| 08 | `08-context.txt` | 6 s | See agent activity without losing the thread. |
| 09 | `09-responsibility.txt` | 7 s | You remain responsible for what happens next. |
| 10 | `10-resolve.txt` | 5 s | Your coding agent. Your workspace. |
| 11 | `11-hold.txt` | 4 s | Gentle Shell. Built for Pi. |

**Revisa en cada pieza:**

- [ ] La voz dice exactamente la frase y termina antes del final.
- [ ] Suena como la misma voz de las piezas anteriores.
- [ ] El título está en el mismo lugar y con la misma letra que en las otras piezas.
- [ ] No aparecen versiones, nombres de modelos ni precios.
- [ ] En 9x16 no hay nada importante arriba ni en la mitad de abajo (ahí van los subtítulos y los controles del celular).
- [ ] Solo en la 01: el primer cuadro es el thumbnail.

### 3. Pasa las piezas a MP4

Desde esta carpeta, cada vez que una pieza quede bien:

```bash
node export-piece.mjs 05        # solo la pieza 05, en los dos formatos
node export-piece.mjs all       # las 11 piezas, en los dos formatos
```

- Cada pieza tarda unos segundos. Salen en `out/16x9/c05.mp4` y `out/9x16/c05.mp4`.
- La pieza 01 también guarda el thumbnail (`thumb.png`).
- Si aparece `warning: ... is not deterministic`, pídele a Claude que quite `Math.random`, `Date` o las animaciones CSS del dibujo y vuelve a exportar.

### 4. Une el video

Desde la raíz del repositorio, en Git Bash:

```bash
bash assets/prompts/gentle-shelll-ligero/generative/assemble.sh 16x9 en
bash assets/prompts/gentle-shelll-ligero/generative/assemble.sh 9x16 en
```

- El segundo argumento elige los subtítulos: `en`, `es` o `none`.
- El video queda en `out/<formato>/gentle-shell-<formato>-<subtítulos>.mp4`.
- La última línea debe decir `1920,1080,1800 (expected 1920,1080,1800)` o `1080,1920,1800 (expected 1080,1920,1800)`.

### 5. Revisión final

Mira cada video con sonido y en silencio, en pantalla grande y en tamaño celular, y comprueba que:

- [ ] Las uniones entre piezas no saltan (sobre todo 02→03, 06→07, 08→09 y 10→11, donde el título o la imagen continúan).
- [ ] La voz no se corta en ningún empalme.

## Si la voz de Claude cambia entre piezas

Genera las líneas en ElevenLabs siguiendo [`../showreel/elevenlabs.md`](../showreel/elevenlabs.md) y guárdalas aquí en `voice/01.mp3` … `voice/11.mp3`. Puedes hacerlo solo con las que suenen distinto: si existe `voice/NN.mp3`, `export-piece.mjs` usa esa voz en lugar del audio de la pieza y la coloca en su segundo exacto. Los efectos de sonido de esa pieza se pierden; si los quieres, pídele a Claude la pieza sin voz y solo con efectos.

## Requisitos

Node, `ffmpeg`/`ffprobe`, Chrome o Edge, y `puppeteer-core` (`npm install -g puppeteer-core`).

## Estado

- Se probó el flujo completo con 11 piezas sintéticas: exportación, voz de ElevenLabs en su segundo exacto, thumbnail en el cuadro 0 y unión con 1800 cuadros y 60,000 s en los dos formatos.
- Todavía no se generó ninguna pieza real con Claude.
- Antes de publicar, revisa los derechos de la voz generada y del uso del logo; ver [`../claims-and-assets.md`](../claims-and-assets.md).
