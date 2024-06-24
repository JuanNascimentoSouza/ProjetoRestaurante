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

document.addEventListener("DOMContentLoaded", function() {
    const closeCartButton = document.getElementById('closeCartPopup');
    const cartPopup = document.getElementById('cartPopup');

    // Função para fechar o modal do carrinho
    function closeCartPopup() {
        cartPopup.style.display = 'none';
    }

    // Quando o usuário clicar no símbolo de fechar (×), fecha o modal do carrinho
    closeCartButton.addEventListener('click', closeCartPopup);

    // Quando o usuário clicar fora do conteúdo do modal do carrinho, fecha o modal
    window.addEventListener('click', function(event) {
        if (event.target == cartPopup) {
            closeCartPopup();
        }
    });
});

// Exemplo de função para abrir o modal do carrinho
function openCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.style.display = 'block';
    updateCart();
}

// Exemplo de função para atualizar o carrinho (para referência)
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
    });

    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const whatsappNumber = "5521966454694";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
}

// Certifique-se de que a função updateAdditionalPrice está definida antes de ser chamada
function updateAdditionalPrice() {
    const additionalPrice = parseFloat(document.getElementById('additionalPrice').dataset.price);
    const additionalQuantity = parseInt(document.getElementById('itemAdditional').value);
    const additionalTotalPrice = additionalPrice * additionalQuantity;
    document.getElementById("additionalPrice").innerText = 'R$ ' + additionalTotalPrice.toFixed(2);

    // Atualizar o preço do item
    const basePrice = parseFloat(document.getElementById('itemPrice').dataset.basePrice);
    const totalPrice = basePrice + additionalTotalPrice;
    document.getElementById('itemPrice').innerText = 'R$ ' + totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    const closeModal = document.getElementById('closeItem');
    const modal = document.getElementById('itemModal');

    // Função para fechar o modal
    function closeModalPopup() {
        modal.style.display = 'none';
    }

    // Quando o usuário clicar no símbolo de fechar (×), fecha o modal
    closeModal.addEventListener('click', closeModalPopup);

    // Quando o usuário clicar fora do conteúdo do modal, fecha o modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModalPopup();
        }
    });
});

function openItemDetails(name, price, image, description, additional, additionalPrice) {
    var modal = document.getElementById("itemModal");
    document.getElementById("itemName").innerText = name;
    const itemPriceElement = document.getElementById("itemPrice");
    itemPriceElement.innerText = price.toFixed(2);
    itemPriceElement.dataset.basePrice = price; // Store base price in data attribute
    document.getElementById("itemImage").src = image;
    document.getElementById("itemDescription").innerText = description;

    const additionalPriceElement = document.getElementById("additionalPrice");
    additionalPriceElement.dataset.price = additionalPrice; // Store additional unit price in data attribute
    additionalPriceElement.innerText = (0).toFixed(2);

    const itemAdditionalElement = document.getElementById("itemAdditional");
    const itemAdditionalDescriptionElement = document.getElementById("itemAddicionalDescription");
    itemAdditionalElement.value = itemAdditionalElement.min; // Reset to min value

    if (additional) {
        showInputs(); // Mostra os inputs se houver adicionais
        itemAdditionalDescriptionElement.innerText = additional;
        updateAdditionalPrice(); // Update price initially
    } else {
        hideInputs(); // Esconde os inputs se não houver adicionais
    }

    document.getElementById("addToCartButton").onclick = function() {
        addItem(name, parseFloat(itemPriceElement.dataset.basePrice), additional, additionalPrice);
        modal.style.display = "none";
    };

    modal.style.display = "block";
}

// Certifique-se de que a função updateAdditionalPrice está definida antes de ser chamada
function updateAdditionalPrice() {
    const additionalPrice = parseFloat(document.getElementById('additionalPrice').dataset.price);
    const additionalQuantity = parseInt(document.getElementById('itemAdditional').value);
    const additionalTotalPrice = additionalPrice * additionalQuantity;
    document.getElementById("additionalPrice").innerText = 'R$ ' + additionalTotalPrice.toFixed(2);

    // Atualizar o preço do item
    const basePrice = parseFloat(document.getElementById('itemPrice').dataset.basePrice);
    const totalPrice = basePrice + additionalTotalPrice;
    document.getElementById('itemPrice').innerText = 'R$ ' + totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    const buttonMinus = document.querySelector('.buttonMinus');
    const buttonPlus = document.querySelector('.buttonPlus');
    const itemAdditional = document.getElementById('itemAdditional');

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

function hideInputs() {
    const inputs = document.querySelectorAll('.inputPopup');
    inputs.forEach(input => {
        input.style.display = 'none'; // Esconde o input
    });

    const buttons = document.querySelectorAll('.buttonMinus, .buttonPlus');
    buttons.forEach(button => {
        button.style.display = 'none'; // Esconde os botões
    });

    const descriptions = document.querySelectorAll('#itemAddicionalDescription, #additionalPrice');
    descriptions.forEach(description => {
        description.style.display = 'none'; // Esconde as descrições
    });
}

function showInputs() {
    const inputs = document.querySelectorAll('.inputPopup');
    inputs.forEach(input => {
        input.style.display = 'block'; // Mostra o input
    });

    const buttons = document.querySelectorAll('.buttonMinus, .buttonPlus');
    buttons.forEach(button => {
        button.style.display = 'block'; // Mostra os botões
    });

    const descriptions = document.querySelectorAll('#itemAddicionalDescription, #additionalPrice');
    descriptions.forEach(description => {
        description.style.display = 'block'; // Mostra as descrições
    });
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
