// Servidor mínimo que sirve el fixture del catálogo como CSV, para que el
// script de screenshots de Playwright no dependa de la hoja real ni de red.
// Devuelve siempre el mismo CSV, sin importar la ruta pedida.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = Number(process.argv[2] ?? 8899);
const csv = readFileSync(join(__dirname, "..", "fixtures", "catalog.csv"), "utf8");

createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/csv; charset=utf-8" });
  res.end(csv);
}).listen(port, () => {
  console.log(`csv-server escuchando en http://localhost:${port}`);
});
