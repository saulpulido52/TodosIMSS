# todosimss — demostración pública

Visualizador independiente de una consulta sobre «¿Aceptas el incremento salarial acordado?». No es una consulta oficial del IMSS o del SNTSS.

## Qué incluye

- Mapa de las 32 entidades y navegación por ciudad y unidad.
- Datos y unidades completamente ficticios.
- Ensayo de voto Sí/No con códigos ficticios.
- Una marca de participación por navegador, origen y consulta, persistente tras recargar.
- Coordinación entre pestañas mediante Web Locks; si no están disponibles, el ensayo se bloquea.
- Agenda propuesta para una mesa de diálogo, sin reuniones ni acuerdos inventados.

## Límites transparentes

**No es un sistema listo para recoger votos reales.** La marca local solo dificulta repeticiones accidentales. Borrar datos, cambiar de navegador, usar modo privado, modificar el JavaScript o visitar otro origen puede eludirla. No identifica dispositivos físicos ni garantiza una persona por voto. Un dispositivo compartido también puede bloquear a un segundo trabajador legítimo.

Los códigos se generan en el navegador, no acreditan trabajadores y no se validan en un servidor. No se envía ni se guarda la respuesta. La única información persistente añadida por la aplicación es la marca `1` bajo la clave de esta consulta, sin nombre, matrícula, NSS, respuesta, ubicación o identificador de dispositivo.

Los resultados del mapa son un corte ficticio fijo. La ocultación de grupos pequeños es **solo visual**: los datos ficticios completos están publicados en `dist/data.js`. En una consulta real, las cifras protegidas deben omitirse también de la API y de los archivos públicos, y debe evitarse deducirlas por diferencia entre agregados.

GitHub Pages publica archivos estáticos. Un sistema real necesita un backend separado que consuma cada código en una transacción atómica, impida reutilización y verifique la elegibilidad mediante un proceso independiente. No se deben publicar códigos, credenciales, padrones, votos individuales ni la base de datos en este repositorio. No se promete privacidad total; el proveedor de alojamiento puede conservar registros técnicos de acceso.

## Publicación con GitHub Pages

1. Crear un repositorio público y subir este proyecto, excluyendo `.git`, `.openai` y cualquier credencial.
2. En **Settings → Pages → Build and deployment → Source**, seleccionar **GitHub Actions**.
3. Ejecutar el workflow **Publicar visualizador** o subir un commit a `main`.
4. Confirmar que el workflow termina correctamente y abrir la URL que devuelve el paso de despliegue.

El workflow publica únicamente `dist/`. El código y las verificaciones permanecen visibles para revisión.

## Revisión local

```bash
node --check dist/app.js
node --test tests/participation.test.cjs
python -m http.server 8080 --directory dist
```

La publicación HTTPS permite utilizar Web Locks en navegadores compatibles.

## Datos geográficos

Geometría procedente de [angelnmara/geojson](https://github.com/angelnmara/geojson), incorporada en `dist/data.js`. Las ubicaciones son referencias territoriales; las unidades y cifras son ficticias. La atribución no implica afiliación ni aval.
