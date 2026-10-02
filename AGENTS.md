# SAEL Mayorista

## Stack

- Next.js 16
- App Router
- TypeScript
- Ant Design
- pnpm
- CSS / CSS Modules
- No Tailwind

## Proyecto

Landing page mayorista de SAEL.

Debe ser:
- Simple
- Mobile first
- Responsive
- Moderna
- Paleta negro, rojo y blanco

## Reglas para Codex

- No crear tests.
- No ejecutar tests.
- No ejecutar build.
- No ejecutar lint.
- No agregar backend.
- No crear API routes.
- No agregar base de datos.
- No instalar dependencias innecesarias.
- No hacer refactors innecesarios.
- Mantener pocos archivos y componentes simples.
- Mantener code clean y solid
- Archivos como maximo de  200lineas
## Reglas obligatorias para Codex

- No ejecutar build.
- No ejecutar tests.
- No crear archivos de test.
- No instalar librerías de testing.
- No ejecutar lint.
- No ejecutar typecheck.
- No crear CI/CD.
- Crear únicamente archivos necesarios para la funcionalidad solicitada.
- El usuario realizará build y validaciones manualmente.
## Nunca contaminar archivos fuente

Está estrictamente prohibido escribir dentro de archivos `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.json` o similares cualquier salida de terminal o metadata de herramientas.

Nunca escribir dentro de archivos fuente textos como:

- Exit code:
- Wall time:
- Output:
- Process exited:
- Command:
- stdout:
- stderr:

La salida de comandos debe quedarse solamente en la terminal.

## JSX y TypeScript

Nunca escribir JSX escapado o contaminado.

Prohibido:

- \<div
- \</div>
- *className*
- *type*
- **new**
- window\.confirm

Usar siempre sintaxis real:

- <div>
- </div>
- className=
- type=
- new Set(...)
- window.confirm(...)

## Encoding

Todos los archivos deben guardarse en UTF-8.

No introducir caracteres corruptos como:

- Ã
- Â
- â
- ƒ

Antes de terminar cualquier cambio, revisar los archivos modificados y confirmar que no contienen texto corrupto.

## Cambios minimos

No reescribir archivos completos cuando el cambio solicitado puede hacerse de forma puntual.

No agregar funcionalidades, textos, componentes o refactors que no hayan sido pedidos.

Mantener la logica existente salvo que la tarea requiera cambiarla.

## Validacion obligatoria

Antes de finalizar:

1. Revisar los archivos modificados.
2. Buscar dentro de `src/`:
   - `Exit code:`
   - `Wall time:`
   - `Output:`
3. Si cualquiera aparece dentro de un archivo fuente, eliminarlo.
4. Ejecutar TypeScript/build.
5. Nunca copiar la salida del build dentro del codigo fuente.