let order = [];

function addItem(name, price, additional, additionalPrice, additional2, additionalPrice2, additional3, additionalPrice3, observation) {
    const quantity = 1;
    const item = { name, price, quantity, observation };

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

    if (additional3) {
        item.additional3 = additional3;
        item.additionalQuantity3 = parseInt(document.getElementById('itemAdditional3').value);
        item.additionalPrice3 = additionalPrice3;
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

        if (item.additional && item.additionalQuantity > 0) {
            const additionalTotal = item.additionalPrice * item.additionalQuantity;
            total += additionalTotal;
            listItem.innerHTML += `
                <br>
                + ${item.additionalQuantity} x ${item.additional}: R$ ${additionalTotal.toFixed(2)}
            `;
        }

        if (item.additional2 && item.additionalQuantity2 > 0) {
            const additionalTotal2 = item.additionalPrice2 * item.additionalQuantity2;
            total += additionalTotal2;
            listItem.innerHTML += `
                <br>
                + ${item.additionalQuantity2} x ${item.additional2}: R$ ${additionalTotal2.toFixed(2)}
            `;
        }

        if (item.additional3 && item.additionalQuantity3 > 0) {
            const additionalTotal3 = item.additionalPrice3 * item.additionalQuantity3;
            total += additionalTotal3;
            listItem.innerHTML += `
                <br>
                + ${item.additionalQuantity3} x ${item.additional3}: R$ ${additionalTotal3.toFixed(2)}
            `;
        }

        // Exibir observação, se houver
        if (item.observation) {
            listItem.innerHTML += `<br><strong>Observação:</strong> ${item.observation}`;
        }

        cartItemsElement.appendChild(listItem);
    });

    document.getElementById('cartTotal').textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removeItem(index) {
    order.splice(index, 1);
    updateCart();
}

async function sendOrder() {
    if (order.length === 0) {
        alert("Seu pedido está vazio.");
        return;
    }

    try {
        const address = document.getElementById('address').value;
        const establishmentAddress = 'Estr. de Itaitindiba, 360 - Santa Izabel, São Gonçalo - RJ, 24738-795';

        const origin = await geocodeAddress(establishmentAddress);
        const destination = await geocodeAddress(address);

        const distance = await calculateDistance(origin, destination);
        const freight = calculateFreightValue(distance);

        const message = buildOrderMessage(order, freight);
        const whatsappLink = `https://wa.me/5521966454694?text=${encodeURIComponent(message)}`;

        window.open(whatsappLink, '_blank');
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        alert('Erro ao enviar pedido. Tente novamente.');
    }
}

async function geocodeAddress(address) {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject(new Error('Erro ao geocodificar o endereço: ' + status));
            }
        });
    });
}

async function calculateDistance(origin, destination) {
    const service = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC
        }, (response, status) => {
            if (status === 'OK') {
                resolve(response.rows[0].elements[0].distance.value / 1000);
            } else {
                reject(new Error('Erro ao calcular a distância: ' + status));
            }
        });
    });
}

function buildOrderMessage(order, freight) {
    let message = "Olá, gostaria de fazer o seguinte pedido:\n";
    let total = 0;

    order.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.quantity} x ${item.name}: R$ ${itemTotal.toFixed(2)}\n`;
        total += itemTotal;

        if (item.additional && item.additionalQuantity > 0) {
            const additionalTotal = item.additionalPrice * item.additionalQuantity;
            message += `  + ${item.additionalQuantity} x ${item.additional}: R$ ${additionalTotal.toFixed(2)}\n`;
            total += additionalTotal;
        }

        if (item.observation) {
            message += `  Observação: ${item.observation}\n`;
        }
    });

    message += `\nFrete: R$ ${freight.toFixed(2)}`;
    total += freight;

    message += `\nTotal: R$ ${total.toFixed(2)}`;
    return message;
}



document.addEventListener("DOMContentLoaded", function() {
    const buttonMinus = document.querySelector('.buttonMinus');
    const buttonPlus = document.querySelector('.buttonPlus');
    const itemAdditional = document.getElementById('itemAdditional');

    const buttonMinus2 = document.querySelector('.buttonMinus2');
    const buttonPlus2 = document.querySelector('.buttonPlus2');
    const itemAdditional2 = document.getElementById('itemAdditional2');

    const buttonMinus3 = document.querySelector('.buttonMinus3');
    const buttonPlus3 = document.querySelector('.buttonPlus3');
    const itemAdditional3 = document.getElementById('itemAdditional3');

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

    buttonMinus3.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional3.value);
        if (currentValue > parseInt(itemAdditional3.min)) {
            itemAdditional3.value = currentValue - 1;
            updateAdditionalPrice();
        }
    });

    buttonPlus3.addEventListener('click', function() {
        let currentValue = parseInt(itemAdditional3.value);
        if (currentValue < parseInt(itemAdditional3.max)) {
            itemAdditional3.value = currentValue + 1;
            updateAdditionalPrice();
        }
    });
});

function openItemDetails(name, price, image, description, additional, additionalPrice, additional2, additionalPrice2, additional3, additionalPrice3) {
    var modal = document.getElementById("itemModal");
    document.getElementById("itemName").innerText = name;
    const itemPriceElement = document.getElementById("itemPrice");
    itemPriceElement.innerText = price.toFixed(2);
    itemPriceElement.dataset.basePrice = price;
    document.getElementById("itemImage").src = image;
    document.getElementById("itemDescription").innerText = description;

    const additionalPriceElement = document.getElementById("additionalPrice");
    additionalPriceElement.dataset.price = additionalPrice || 0;
    additionalPriceElement.innerText = 'R$ 0.00';

    const itemAdditionalElement = document.getElementById("itemAdditional");
    const itemAdditionalDescriptionElement = document.getElementById("itemAddicionalDescription");
    itemAdditionalElement.value = itemAdditionalElement.min;

    if (additional && additionalPrice) {
        document.getElementById("inputHide").style.display = 'flex';
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

    if (additional2 && additionalPrice2) {
        document.querySelector('.inputPopup2').style.display = 'flex';
        itemAdditionalDescriptionElement2.innerText = additional2;
        additionalPriceElement2.innerText = 'R$ ' + additionalPrice2.toFixed(2);
    } else {
        document.querySelector('.inputPopup2').style.display = 'none';
    }

    const additionalPriceElement3 = document.getElementById("additionalPrice3");
    additionalPriceElement3.dataset.price = additionalPrice3 || 0;
    additionalPriceElement3.innerText = 'R$ 0.00';

    const itemAdditionalElement3 = document.getElementById("itemAdditional3");
    const itemAdditionalDescriptionElement3 = document.getElementById("itemAddicionalDescription3");
    itemAdditionalElement3.value = itemAdditionalElement3.min;

    if (additional3 && additionalPrice3) {
        document.getElementById("inputHide3").style.display = 'flex';
        itemAdditionalDescriptionElement3.innerText = additional3;
        additionalPriceElement3.innerText = 'R$ ' + additionalPrice3.toFixed(2);
    } else {
        document.getElementById("inputHide3").style.display = 'none';
    }

    modal.style.display = "block";
}

document.getElementById('addToCartButton').addEventListener('click', function() {
    const itemName = document.getElementById("itemName").innerText;
    const itemPrice = parseFloat(document.getElementById("itemPrice").dataset.basePrice);
    const itemAdditionalDescription = document.getElementById("itemAddicionalDescription").innerText;
    const additionalPrice = parseFloat(document.getElementById("additionalPrice").dataset.price);
    const itemAdditionalDescription2 = document.getElementById("itemAddicionalDescription2").innerText;
    const additionalPrice2 = parseFloat(document.getElementById("additionalPrice2").dataset.price);
    const itemAdditionalDescription3 = document.getElementById("itemAddicionalDescription3").innerText;
    const additionalPrice3 = parseFloat(document.getElementById("additionalPrice3").dataset.price);
    const itemObservation = document.getElementById("itemObservation").value; // Captura a observação

    addItem(itemName, itemPrice, itemAdditionalDescription, additionalPrice, itemAdditionalDescription2, additionalPrice2, itemAdditionalDescription3, additionalPrice3, itemObservation);
    document.getElementById("itemModal").style.display = "none";
});

function updateAdditionalPrice() {
    const itemPrice = parseFloat(document.getElementById("itemPrice").dataset.basePrice);

    const additionalPriceElement = document.getElementById("additionalPrice");
    const additionalPrice = parseFloat(additionalPriceElement.dataset.price);
    const additionalQuantity = parseInt(document.getElementById("itemAdditional").value);
    const additionalTotal = additionalPrice * additionalQuantity;

    const additionalPriceElement2 = document.getElementById("additionalPrice2");
    const additionalPrice2 = parseFloat(additionalPriceElement2.dataset.price);
    const additionalQuantity2 = parseInt(document.getElementById("itemAdditional2").value);
    const additionalTotal2 = additionalPrice2 * additionalQuantity2;

    const additionalPriceElement3 = document.getElementById("additionalPrice3");
    const additionalPrice3 = parseFloat(additionalPriceElement3.dataset.price);
    const additionalQuantity3 = parseInt(document.getElementById("itemAdditional3").value);
    const additionalTotal3 = additionalPrice3 * additionalQuantity3;

    const total = itemPrice + additionalTotal + additionalTotal2 + additionalTotal3;
    document.getElementById("itemPrice").innerText = total.toFixed(2);
}

document.addEventListener('click', function(event) {
    const modal = document.getElementById("itemModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.getElementById('closeItem').addEventListener('click', function() {
    document.getElementById("itemModal").style.display = "none";
});

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

function calculateFreight() {
    const address = document.getElementById('address').value;
    const establishmentAddress = 'Estr. de Itaitindiba, 360 - Santa Izabel, São Gonçalo - RJ, 24738-795';
    
    const geocoder = new google.maps.Geocoder();

    // Geocode do endereço do estabelecimento
    geocoder.geocode({ 'address': establishmentAddress }, function(establishmentResults, status) {
        if (status === 'OK') {
            const origin = establishmentResults[0].geometry.location;

            // Geocode do endereço do usuário
            geocoder.geocode({ 'address': address }, function(userResults, status) {
                if (status === 'OK') {
                    const destination = userResults[0].geometry.location;

                    const service = new google.maps.DistanceMatrixService();
                    service.getDistanceMatrix({
                        origins: [origin],
                        destinations: [destination],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.METRIC
                    }, function(response, status) {
                        if (status === 'OK') {
                            const distance = response.rows[0].elements[0].distance.value / 1000;
                            const freight = calculateFreightValue(distance);
                            document.getElementById('result').innerText = `Distância: ${distance.toFixed(2)} km\nFrete: R$ ${freight.toFixed(2)}`;
                            console.log(`Distância: ${distance.toFixed(2)} km, Frete: R$ ${freight.toFixed(2)}`);

                        } else {
                            console.error('Erro ao calcular a distância:', status);
                            alert('Erro ao calcular a distância: ' + status);
                        }
                    });
                } else {
                    console.error('Erro ao geocodificar o endereço do cliente:', status);
                    alert('Erro ao geocodificar o endereço do cliente: ' + status);
                }
            });
        } else {
            console.error('Erro ao geocodificar o endereço do estabelecimento:', status);
            alert('Erro ao geocodificar o endereço do estabelecimento: ' + status);
        }
    });
}

function calculateFreightValue(distance) {
    const fixedRate = 4;
    const ratePerKm = 2;
    return fixedRate + (ratePerKm * distance);
}

preloadImagens();
