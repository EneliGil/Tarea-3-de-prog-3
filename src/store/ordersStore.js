let orders = [
    {
        id: 1,
        customer: "Valeria M\u00e9ndez",
        product: "Latte de vainilla y croissant de mantequilla",
        quantity: 2,
        price: 420,
        notes: "Sin az\u00facar extra en el caf\u00e9",
        status: "En preparaci\u00f3n"
    },
    {
        id: 2,
        customer: "Mateo Castillo",
        product: "Porci\u00f3n de bizcocho de chocolate y capuchino",
        quantity: 1,
        price: 550,
        notes: "Empaque para llevar",
        status: "Listo"
    },
    {
        id: 3,
        customer: "Sof\u00eda Herrera",
        product: "Cheesecake de fresa y espresso doble",
        quantity: 3,
        price: 1140,
        notes: "Incluir 3 servilletas y cucharitas",
        status: "Pendiente"
    }
];

let nextId = 4;

const VALID_STATUSES = ["Pendiente", "En preparaci\u00f3n", "Listo"];

function getAllOrders() {
    return orders;
}

function createOrder(data) {
    const newOrder = {
        id: nextId++,
        customer: String(data.customer).trim(),
        product: String(data.product).trim(),
        quantity: Math.max(1, Number(data.quantity) || 1),
        price: Math.max(0, Number(data.price) || 0),
        notes: String(data.notes || "").trim(),
        status: VALID_STATUSES.includes(data.status) ? data.status : "Pendiente"
    };
    orders.push(newOrder);
    return newOrder;
}

function updateOrder(id, data) {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    const current = orders[idx];
    orders[idx] = {
        ...current,
        customer: data.customer !== undefined ? String(data.customer).trim() : current.customer,
        product: data.product !== undefined ? String(data.product).trim() : current.product,
        quantity: data.quantity !== undefined ? Math.max(1, Number(data.quantity) || 1) : current.quantity,
        price: data.price !== undefined ? Math.max(0, Number(data.price) || 0) : current.price,
        notes: data.notes !== undefined ? String(data.notes).trim() : current.notes,
        status: VALID_STATUSES.includes(data.status) ? data.status : current.status
    };
    return orders[idx];
}

function deleteOrder(id) {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const [removed] = orders.splice(idx, 1);
    return removed;
}

module.exports = {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
};
// modulo de pedidos
