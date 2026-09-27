# Colores de trabajo para piezas visuales

Esta es una **paleta histórica de trabajo, propuesta y derivada de los assets**, no una paleta oficial certificada ni un conjunto de tokens de marca. Se documenta en el [prompt v2](../prompts/v2-ten-png-gif/PROMPT.md) y reaparece en [un prompt v5](../prompts/v5-phone-wallpapers/GENTLE-AI-CINEMATIC.md). Su uso no acredita la aprobación de las marcas o composiciones propuestas.

| Valor | Función visual propuesta | Aplicación orientativa |
| --- | --- | --- |
| `#0B0910` | Casi negro profundo | Fondo oscuro principal. |
| `#251124` | Ciruela / grafito oscuro | Paneles y superficies oscuras secundarias. |
| `#FFF7F1` | Blanco cálido | Fondo claro o texto principal sobre fondo oscuro. |
| `#F095C8` | Rosa contenido | Acentos puntuales y destacados, no texto pequeño sin comprobar contraste. |
| `#D7A0B8` | Rosa suave | Acentos secundarios; evitar usarlo como texto tenue sobre blanco. |

## Legibilidad y uso

- Priorizar `#FFF7F1` sobre `#0B0910` o `#251124` para texto en piezas oscuras, y `#0B0910` sobre `#FFF7F1` para texto en piezas claras. Verificar contraste en la composición final (incluidas transparencias, gradientes y tamaños de letra); para texto normal apuntar al menos a 4,5:1 y para texto grande a 3:1.
- Reservar los rosas para énfasis, no depender únicamente del color para transmitir significado. Comprobar la lectura al tamaño final, especialmente en pantallas de teléfono.
- Muestrear las imágenes originales del logotipo con transparencia real, si están disponibles: inspeccionar píxeles opacos y semitransparentes sobre fondos claros y oscuros, sin confundir el fondo de una previsualización con un color propio del símbolo. Si una referencia contiene un fondo oscuro incrustado, usar un panel oscuro deliberado en vez de fingir que es transparente o recolorear la marca a ciegas.

Los parámetros de insignias del [README fijado de Gentle-AI](https://github.com/Gentleman-Programming/gentle-ai/blob/e8c9f5959cda64d64cb375de04fed524fef23d78/README.md), `labelColor=#1A1218` y colores `#F095C8` / `#D7A0B8`, son **ejemplos de insignias**, no tokens de diseño ni certificación de esta paleta. Fuente consultada: 2026-09-27.
