let order = [];

function addItem(name, price, additional, additionalPrice, additional2, additionalPrice2) {
    const quantity = 1;
    const item = { name, price, quantity };

    if (additional) {
        item.additional = additional;
        item.additionalQuantity = parseInt(document.getElementById('itemAdditional').value);
        item.additionalPrice = additionalPrice;
    }

    if (additional2) {
        item.additional2 = additional2;
        item.additionalQuantity2 = parseInt(document.getElementById('itemAdditional2').value);
        item.additionalPrice2 = additionalPrice2;
    }

    order.push(item);
}

document.addEventListener("DOMContentLoaded", function() {
    const closeCartButton = document.getElementById('closeCartPopup');
    const cartPopup = document.getElementById('cartPopup');

    function closeCartPopup() {
        cartPopup.style.display = 'none';
    }

    closeCartButton.addEventListener('click', closeCartPopup);

    window.addEventListener('click', function(event) {
        if (event.target == cartPopup) {
            closeCartPopup();
        }
    });
});

function openCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.style.display = 'block';
    updateCart();
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

        if (item.additional2) {
            const additionalTotal2 = item.additionalPrice2 * item.additionalQuantity2;
            total += additionalTotal2;
            listItem.innerHTML += `
                <br>
                + ${item.additionalQuantity2} x ${item.additional2}: R$ ${additionalTotal2.toFixed(2)}
            `;
        }

        cartItemsElement.appendChild(listItem);
    });

    document.getElementById('cartTotal').textContent = `Total: R$ ${total.toFixed(2)}`;
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

        if (item.additional2) {
            const additionalTotal2 = item.additionalPrice2 * item.additionalQuantity2;
            message += `  + ${item.additionalQuantity2} x ${item.additional2}: R$ ${additionalTotal2.toFixed(2)}\n`;
            total += additionalTotal2;
        }
    });

    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const whatsappNumber = "5521966454694";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
}

function updateAdditionalPrice() {
    const additionalPrice = parseFloat(document.getElementById('additionalPrice').dataset.price || 0);
    const additionalQuantity = parseInt(document.getElementById('itemAdditional').value || 0);
    const additionalTotalPrice = additionalPrice * additionalQuantity;
    document.getElementById("additionalPrice").innerText = 'R$ ' + additionalTotalPrice.toFixed(2);

    const additionalPrice2 = parseFloat(document.getElementById('additionalPrice2').dataset.price || 0);
    const additionalQuantity2 = parseInt(document.getElementById('itemAdditional2').value || 0);
    const additionalTotalPrice2 = additionalPrice2 * additionalQuantity2;
    document.getElementById("additionalPrice2").innerText = 'R$ ' + additionalTotalPrice2.toFixed(2);

    const basePrice = parseFloat(document.getElementById('itemPrice').dataset.basePrice);
    const totalPrice = basePrice + additionalTotalPrice + additionalTotalPrice2;
    document.getElementById('itemPrice').innerText = 'R$ ' + totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    const buttonMinus = document.querySelector('.buttonMinus');
    const buttonPlus = document.querySelector('.buttonPlus');
    const itemAdditional = document.getElementById('itemAdditional');

    const buttonMinus2 = document.querySelector('.buttonMinus2');
    const buttonPlus2 = document.querySelector('.buttonPlus2');
    const itemAdditional2 = document.getElementById('itemAdditional2');

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

    buttonMinus2.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional2.value);
        if (currentValue > parseInt(itemAdditional2.min)) {
            itemAdditional2.value = currentValue - 1;
            updateAdditionalPrice();
        }
    });

    buttonPlus2.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional2.value);
        if (currentValue < parseInt(itemAdditional2.max)) {
            itemAdditional2.value = currentValue + 1;
            updateAdditionalPrice();
        }
    });
});

function openItemDetails(name, price, image, description, additional, additionalPrice, additional2, additionalPrice2) {
    var modal = document.getElementById("itemModal");
    document.getElementById("itemName").innerText = name;
    const itemPriceElement = document.getElementById("itemPrice");
    itemPriceElement.innerText = 'R$ ' + price.toFixed(2);
    itemPriceElement.dataset.basePrice = price;
    document.getElementById("itemImage").src = image;
    document.getElementById("itemDescription").innerText = description;

    const additionalPriceElement = document.getElementById("additionalPrice");
    additionalPriceElement.dataset.price = additionalPrice || 0;
    additionalPriceElement.innerText = 'R$ 0.00';

    const itemAdditionalElement = document.getElementById("itemAdditional");
    const itemAdditionalDescriptionElement = document.getElementById("itemAddicionalDescription");
    itemAdditionalElement.value = itemAdditionalElement.min;

    // Check if additional and additionalPrice are provided
    if (additional && additionalPrice) {
        document.getElementById("inputHide").style.display = 'block';
        itemAdditionalDescriptionElement.innerText = additional;
        additionalPriceElement.innerText = 'R$ ' + additionalPrice.toFixed(2);
    } else {
        document.getElementById("inputHide").style.display = 'none';
    }

    const additionalPriceElement2 = document.getElementById("additionalPrice2");
    additionalPriceElement2.dataset.price = additionalPrice2 || 0;
    additionalPriceElement2.innerText = 'R$ 0.00';

    const itemAdditionalElement2 = document.getElementById("itemAdditional2");
    const itemAdditionalDescriptionElement2 = document.getElementById("itemAddicionalDescription2");
    itemAdditionalElement2.value = itemAdditionalElement2.min;

    if (additional2) {
        showInputs('inputPopup2', 'itemAdditional2', 'itemAddicionalDescription2', additional2);
    } else {
        hideInputs('inputPopup2', 'itemAdditional2', 'itemAddicionalDescription2');
    }

    document.getElementById("addToCartButton").onclick = function() {
        addItem(name, parseFloat(itemPriceElement.dataset.basePrice), additional, additionalPrice, additional2, additionalPrice2);
        modal.style.display = "none";
    };

    modal.style.display = "block";
}


function hideInputs(popupClass, inputId, descriptionId) {
    const inputs = document.querySelectorAll(`.${popupClass}`);
    inputs.forEach(input => {
        input.style.display = 'none';
    });

    const input = document.getElementById(inputId);
    input.style.display = 'none';

    const description = document.getElementById(descriptionId);
    description.style.display = 'none';
}

function showInputs(popupClass, inputId, descriptionId, additional) {
    const inputs = document.querySelectorAll(`.${popupClass}`);
    inputs.forEach(input => {
        input.style.display = 'block';
    });

    const input = document.getElementById(inputId);
    input.style.display = 'block';

    const description = document.getElementById(descriptionId);
    description.innerText = additional;
    description.style.display = 'block';
}

// Fechar modal ao clicar no "x" ou fora do popup
document.addEventListener("DOMContentLoaded", function() {
    const closeItemModalButton = document.getElementById('closeItem');
    const itemModal = document.getElementById('itemModal');

    closeItemModalButton.addEventListener('click', function() {
        itemModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == itemModal) {
            itemModal.style.display = 'none';
        }
    });
});

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

document.getElementById('copyImage').addEventListener('click', function() {
    const url = window.location.href;
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'URL copiada para a área de transferência!';
});

window.addEventListener('scroll', function() {
    const stickyElement = document.getElementById('stickyElement');
    const stickyContainer = document.querySelector('.sticky-container');
    const offsetTop = stickyContainer.offsetTop;

    if (window.pageYOffset > offsetTop) {
        stickyElement.classList.add('sticky');
    } else {
        stickyElement.classList.remove('sticky');
    }
});

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
];

function preloadImagens() {
    for (var i = 0; i < imagens.length; i++) {
        var img = new Image();
        img.src = imagens[i];
    }
}

preloadImagens();
