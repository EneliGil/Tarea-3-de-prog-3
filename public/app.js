const ordersContainer = document.getElementById("ordersContainer");
const orderForm = document.getElementById("orderForm");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getStatusClass(status) {
    if (status === "En preparaci\u00f3n") return "st-En";
    if (status === "Listo") return "st-Listo";
    return "st-Pendiente";
}

async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    const q = searchInput.value.trim().toLowerCase();
    const st = statusFilter.value;

    const filtered = data.filter((o) => {
        const matchesStatus = st === "ALL" || o.status === st;
        const matchesQuery =
            !q ||
            o.customer.toLowerCase().includes(q) ||
            o.product.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
    });

    if (!filtered.length) {
        ordersContainer.innerHTML = '<div class="empty">No hay pedidos que coincidan con el filtro.</div>';
        return;
    }

    ordersContainer.innerHTML = filtered
        .map((o) => `
      <div class="order-item">
        <div class="order-top">
          <span class="customer">#${o.id} \u00b7 ${escapeHtml(o.customer)}</span>
          <span class="badge ${getStatusClass(o.status)}">${escapeHtml(o.status)}</span>
        </div>
        <div class="product">${escapeHtml(o.product)} (x${o.quantity})</div>
        <div class="meta">Total: RD$ ${Number(o.price).toLocaleString()}${o.notes ? " \u00b7 Nota: " + escapeHtml(o.notes) : ""}</div>
        <div class="actions">
          <button class="btn-sm" onclick="changeStatus(${o.id}, 'En preparaci\u00f3n')">En preparaci\u00f3n</button>
          <button class="btn-sm" onclick="changeStatus(${o.id}, 'Listo')">Marcar listo</button>
          <button class="btn-sm btn-del" onclick="deleteOrder(${o.id})">Eliminar</button>
        </div>
      </div>
    `)
        .join("");
}

orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
        customer: document.getElementById("customer").value.trim(),
        product: document.getElementById("product").value.trim(),
        quantity: Number(document.getElementById("quantity").value) || 1,
        price: Number(document.getElementById("price").value) || 0,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value.trim()
    };
    if (!payload.customer || !payload.product) return;

    await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    orderForm.reset();
    document.getElementById("quantity").value = "1";
    document.getElementById("price").value = "350";
    loadOrders();
});

async function changeStatus(id, status) {
    await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    loadOrders();
}

async function deleteOrder(id) {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    loadOrders();
}

searchInput.addEventListener("input", loadOrders);
statusFilter.addEventListener("change", loadOrders);
loadOrders(); s();