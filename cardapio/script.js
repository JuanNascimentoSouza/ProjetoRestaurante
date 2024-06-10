let order = [];

function addItem(name, price) {
    const quantity = 1;
    order.push({ name, price, quantity });
    
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
    });

    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const whatsappNumber = "5521966454694";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappLink, '_blank');
}

// Adicionando event listeners para abrir e fechar o popup
document.getElementById('openCartButton').addEventListener('click', openCartPopup);
document.getElementById('closeCartPopup').addEventListener('click', closeCartPopup);

// Fechar o popup quando clicar fora dele
window.onclick = function(event) {
    const cartPopup = document.getElementById('cartPopup');
    if (event.target === cartPopup) {
        closeCartPopup();
    }
};

// Seleciona todos os elementos com a classe 'botaoAdicionar' e adiciona o evento de clique a cada um
var buttons = document.getElementsByClassName('botaoAdicionar');

// Itera sobre todos os elementos com a classe 'botaoAdicionar'
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
        var button = this;
        button.textContent = 'Adicionado ao carrinho'; // Altera o texto do botão para "Adicionado"
        button.classList.add('changed'); // Adiciona a classe para alterar a cor do botão

        setTimeout(function() {
            button.textContent = 'Adicionar'; // Retorna o texto do botão para "Clique aqui"
            button.classList.remove('changed'); // Remove a classe após 3 segundos
        }, 3000); // 3000 milissegundos = 3 segundos
    });
}
var botoesAdicionar = document.getElementsByClassName('botaoAdicionar');
for(var i = 0; i < botoesAdicionar.length; i++) {
    botoesAdicionar[i].addEventListener('click', function(event) {
        event.stopPropagation();
    });
}


// Seleciona todos os elementos com a classe 'share' e adiciona o evento de clique a cada um
var buttons = document.getElementsByClassName('share');

// Itera sobre todos os elementos com a classe 'share'
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
        var button = this;
        button.textContent = 'Adicionado ao carrinho'; // Altera o texto do botão para "Adicionado"
        button.classList.add('changed'); // Adiciona a classe para alterar a cor do botão

        setTimeout(function() {
            button.textContent = 'Adicionar'; // Retorna o texto do botão para "Clique aqui"
            button.classList.remove('changed'); // Remove a classe após 3 segundos
        }, 3000); // 3000 milissegundos = 3 segundos
    });
}
var botoesAdicionar = document.getElementsByClassName('share');
for(var i = 0; i < botoesAdicionar.length; i++) {
    botoesAdicionar[i].addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// script.js
document.addEventListener('DOMContentLoaded', (event) => {
    const messageElement = document.getElementById('message');
    
    // Define o tempo em milissegundos (4000 ms = 4 segundos)
    const tempoDesaparecer = 4100; 

    // Define um temporizador para esconder o parágrafo após o tempo especificado
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, tempoDesaparecer);
});



window.addEventListener('scroll', function() {
    var stickyElement = document.getElementById('stickyElement');
    var stickyContainer = document.querySelector('.sticky-container');
    var stickyContainerOffset = stickyContainer.offsetTop;
    
    if (window.pageYOffset >= stickyContainerOffset) {
        stickyElement.classList.add('sticky');
    } else {
        stickyElement.classList.remove('sticky');
    }
});



function openItemDetails(name, price, image, description) {
    var modal = document.getElementById("itemModal");
    document.getElementById("itemName").innerText = name;
    document.getElementById("itemPrice").innerText = price;
    document.getElementById("itemImage").src = image; // Adiciona a imagem ao modal
    document.getElementById("itemDescription").innerText = description; // Adiciona a descrição ao modal
    document.getElementById("addToCartButton").onclick = function() {
        addItem(name, price);
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

    // Fecha a janela de popup da parte dos hamburgueres
    document.getElementById('closeItem').addEventListener('click', function() {
        document.getElementById('itemModal').style.display = 'none';
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



