let order = [];

function addItem(name, price, additional, additionalPrice) {
    const quantity = 1;
    const item = { name, price, quantity };

    if (additional) {
        item.additional = additional;
        item.additionalQuantity = parseInt(document.getElementById('itemAdditional').value);
        item.additionalPrice = additionalPrice;
    }

    order.push(item);
}

function updateCart() {
    const cartItemsElement = document.getElementById('cartItems');
    cartItemsElement.innerHTML = '';

    let total = 0;

    order.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.quantity} x ${item.name}: R$ ${itemTotal.toFixed(2)}
            <button onclick="removeItem(${index})">Remover</button>
        `;

        if (item.additional) {
            const additionalTotal = item.additionalPrice * item.additionalQuantity;
            total += additionalTotal;
            listItem.innerHTML += `
                <br>
                + ${item.additionalQuantity} x ${item.additional}: R$ ${additionalTotal.toFixed(2)}
            `;
        }

        cartItemsElement.appendChild(listItem);
    });

    document.getElementById('cartTotal').textContent = `\nTotal: R$ ${total.toFixed(2)}`;
}

function openCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.style.display = 'block';
    updateCart();
}

function closeCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.style.display = 'none';
}

function removeItem(index) {
    order.splice(index, 1);
    updateCart();
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

        if (item.additional) {
            const additionalTotal = item.additionalPrice * item.additionalQuantity;
            message += `  + ${item.additionalQuantity} x ${item.additional}: R$ ${additionalTotal.toFixed(2)}\n`;
            total += additionalTotal;
        }
    });

    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const whatsappNumber = "5521966454694";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
}

document.getElementById('openCartButton').addEventListener('click', openCartPopup);
document.getElementById('closeCartPopup').addEventListener('click', closeCartPopup);

window.onclick = function(event) {
    const cartPopup = document.getElementById('cartPopup');
    if (event.target === cartPopup) {
        closeCartPopup();
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const buttonMinus = document.querySelector('.buttonMinus');
    const buttonPlus = document.querySelector('.buttonPlus');
    const itemAdditional = document.getElementById('itemAdditional');

    function updateAdditionalPrice() {
        const additionalPrice = parseFloat(document.getElementById('additionalPrice').dataset.price);
        const additionalQuantity = parseInt(itemAdditional.value);
        const additionalTotalPrice = additionalPrice * additionalQuantity;
        document.getElementById("additionalPrice").innerText = 'R$ ' + additionalTotalPrice.toFixed(2);

        // Update item price
        const basePrice = parseFloat(document.getElementById('itemPrice').dataset.basePrice);
        const totalPrice = basePrice + additionalTotalPrice;
        document.getElementById('itemPrice').innerText = 'R$ ' + totalPrice.toFixed(2);
    }

    buttonMinus.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional.value);
        if (currentValue > parseInt(itemAdditional.min)) {
            itemAdditional.value = currentValue - 1;
            updateAdditionalPrice();
        }
    });

    buttonPlus.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional.value);
        if (currentValue < parseInt(itemAdditional.max)) {
            itemAdditional.value = currentValue + 1;
            updateAdditionalPrice();
        }
    });
});

function openItemDetails(name, price, image, description, additional, additionalPrice) {
    var modal = document.getElementById("itemModal");
    document.getElementById("itemName").innerText = name;
    const itemPriceElement = document.getElementById("itemPrice");
    itemPriceElement.innerText = 'R$ ' + price.toFixed(2);
    itemPriceElement.dataset.basePrice = price; // Store base price in data attribute
    document.getElementById("itemImage").src = image;
    document.getElementById("itemDescription").innerText = description;

    const additionalPriceElement = document.getElementById("additionalPrice");
    additionalPriceElement.dataset.price = additionalPrice; // Store additional unit price in data attribute
    additionalPriceElement.innerText = 'R$ ' + (0).toFixed(2);

    const itemAdditionalElement = document.getElementById("itemAdditional");
    const itemAdditionalDescriptionElement = document.getElementById("itemAddicionalDescription");
    itemAdditionalElement.value = itemAdditionalElement.min; // Reset to min value

    function updateAdditionalPrice() {
        const price = additionalPrice * parseInt(itemAdditionalElement.value);
        additionalPriceElement.innerText = 'R$ ' + price.toFixed(2);
        
        // Update item price
        const basePrice = parseFloat(itemPriceElement.dataset.basePrice);
        const totalPrice = basePrice + price;
        itemPriceElement.innerText = 'R$ ' + totalPrice.toFixed(2);
    }

    if (additional) {
        itemAdditionalElement.style.display = 'block';
        itemAdditionalDescriptionElement.innerText = additional;
        itemAdditionalDescriptionElement.style.display = 'block';
        updateAdditionalPrice(); // Update price initially
    } else {
        itemAdditionalElement.style.display = 'none';
        itemAdditionalDescriptionElement.style.display = 'none';
    }

    document.getElementById("addToCartButton").onclick = function() {
        addItem(name, parseFloat(itemPriceElement.dataset.basePrice), additional, additionalPrice);
        modal.style.display = "none";
    };

    modal.style.display = "block";

    document.getElementsByClassName("close")[0].onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Abre o popup de informações
document.getElementById('infoPopup').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'block';
});

// Fecha o popup de informações
document.getElementById('closeInfo').addEventListener('click', function() {
    document.getElementById('infoModal').style.display = 'none';
});

// Fecha o popup se o usuário clicar fora do conteúdo do popup
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('infoModal')) {
        document.getElementById('infoModal').style.display = 'none';
    }
});

// script.js
document.getElementById('copyImage').addEventListener('click', function() {
    // Obtém a URL atual
    const url = window.location.href;
    
    // Cria um elemento temporário de input
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.value = url;
    
    // Adiciona o input ao corpo do documento
    document.body.appendChild(tempInput);
    
    // Seleciona o conteúdo do input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o conteúdo selecionado para a área de transferência
    document.execCommand('copy');
    
    // Remove o input temporário
    document.body.removeChild(tempInput);

    // Mostra uma mensagem de confirmação
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'URL copiada para a área de transferência!';
});

// Lista de caminhos para as imagens
var imagens = [
    "assets/brahma.jpg",
    "assets/burgerfrango.png",
    "assets/cheeseburger.png",
    "assets/duplobacon.png",
    "assets/quartobacon.png",
    "assets/triplobacon.png",
    "assets/burgersalada.png",
    "assets/cocacola.png",
    "assets/guarana2lt.png",
    "assets/heineken.png",
    "assets/icons8-cart-64.png",
    "assets/icons8-close-48.png",
    "assets/imagem1.icons8-info-50.png",
    "assets/imagem2.icons8-share-48.png",
    "assets/imagem3.mozedlogo.png",
    "assets/mozerd_capa.png",
    "assets/pepsi1.png",
    "assets/pizzacogumelo.png",
    "assets/pizza4queijos.png",
    "assets/pizzamargueritha.png",
    "assets/pizzabacon.png",
    "assets/pizzafrangocatupiry.png",
    "assets/pizzacalabresa.png",
    "assets/cocacola2lt.png",
    "assets/coxinha.png",
    "assets/pastel.png",
    "assets/hotdog.png",
    "assets/pasteldeforno.png",
    "assets/batatafrita.png",
    "assets/batatafritaturbinada.png",
    // Adicione todos os caminhos para as suas imagens aqui
];

// Função para pré-carregar as imagens
function preloadImagens() {
    for (var i = 0; i < imagens.length; i++) {
        var img = new Image();
        img.src = imagens[i];
    }
}

// Chame a função de pré-carregamento
preloadImagens();
