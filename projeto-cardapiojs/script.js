let order = [];

function addItem(name, price, quantity) {
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity <= 0) {
        alert("A quantidade deve ser um número inteiro maior que zero.");
        return;
    }
    order.push({ name, price, quantity });
    alert(`${quantity} x ${name} adicionado(s) ao pedido.`);
}

function sendOrder() {
    if (order.length === 0) {
        alert("Seu pedido está vazio.");
        return;
    }

    let message = "Olá, gostaria de fazer o seguinte pedido:\n";
    let total = 0;

    order.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.quantity} x ${item.name}: R$ ${itemTotal.toFixed(2)}\n`;
        total += itemTotal;
    });

    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const whatsappNumber = "5521999999999"; // Substitua pelo número de WhatsApp da sua empresa
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Tentativa de abrir o link do WhatsApp
    try {
        window.open(whatsappLink, '_blank');
    } catch (error) {
        alert("Não foi possível abrir o link do WhatsApp. Por favor, verifique suas configurações de navegador.");
    }
}
