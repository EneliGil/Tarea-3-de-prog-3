const {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
} = require("../store/ordersStore");

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 1e6) reject(new Error("Payload too large"));
        });
        req.on("end", () => {
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });
        req.on("error", reject);
    });
}

async function handleOrdersApi(req, res, pathname) {
    if (pathname === "/api/orders" && req.method === "GET") {
        return sendJson(res, 200, getAllOrders());
    }

    if (pathname === "/api/orders" && req.method === "POST") {
        try {
            const body = await parseBody(req);
            if (!body.customer || !body.product) {
                return sendJson(res, 400, { error: "customer y product son obligatorios" });
            }
            const created = createOrder(body);
            return sendJson(res, 201, created);
        } catch {
            return sendJson(res, 400, { error: "JSON inválido" });
        }
    }

    const matchId = pathname.match(/^\/api\/orders\/(\d+)$/);
    if (matchId) {
        const id = Number(matchId[1]);

        if (req.method === "PUT") {
            try {
                const body = await parseBody(req);
                const updated = updateOrder(id, body);
                if (!updated) return sendJson(res, 404, { error: "Pedido no encontrado" });
                return sendJson(res, 200, updated);
            } catch {
                return sendJson(res, 400, { error: "JSON inválido" });
            }
        }

        if (req.method === "DELETE") {
            const removed = deleteOrder(id);
            if (!removed) return sendJson(res, 404, { error: "Pedido no encontrado" });
            return sendJson(res, 200, { deleted: removed });
        }
    }

    return false;
}

module.exports = { handleOrdersApi, sendJson };
// rutas de la api de pedidos
