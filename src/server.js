// servidor http de la aplicacion
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { handleOrdersApi, sendJson } = require("./routes/ordersRoutes");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8"
};

function serveStaticFile(res, fileName) {
    const filePath = path.join(PUBLIC_DIR, fileName);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            sendJson(res, 404, { error: "Archivo no encontrado" });
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname.startsWith("/api/orders")) {
        const handled = await handleOrdersApi(req, res, pathname);
        if (handled !== false) return;
    }

    if (req.method === "GET" && pathname === "/") {
        return serveStaticFile(res, "index.html");
    }

    if (req.method === "GET" && pathname === "/styles.css") {
        return serveStaticFile(res, "styles.css");
    }

    if (req.method === "GET" && pathname === "/app.js") {
        return serveStaticFile(res, "app.js");
    }

    sendJson(res, 404, { error: "Ruta no encontrada" });
});

server.listen(PORT, () => {
    console.log(`Servidor de pedidos en http://localhost:${PORT}`);
});
