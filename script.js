document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = []; // Array para armazenar os itens do carrinho

    // Função para renderizar o carrinho
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Limpa o conteúdo atual do carrinho
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartTotalSpan.textContent = 'R$ 0,00';
            checkoutButton.disabled = true; // Desabilita o botão de finalizar se o carrinho estiver vazio
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-info">
                    <span>${item.name}</span>
                    <span>(R$ ${item.price.toFixed(2)})</span>
                </div>
                <div class="item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <span class="item-total">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">Remover</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
        checkoutButton.disabled = false; // Habilita o botão de finalizar
    }

    // Adicionar item ao carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            renderCart();
        });
    });

    // Event listener para o carrinho (delegation para botões de +/- e remover)
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const id = parseInt(target.dataset.id);

        if (target.classList.contains('increase-quantity')) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity++;
                renderCart();
            }
        } else if (target.classList.contains('decrease-quantity')) {
            const item = cart.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                renderCart();
            } else if (item && item.quantity === 1) {
                cart = cart.filter(item => item.id !== id); // Remove o item se a quantidade for 1
                renderCart();
            }
        } else if (target.classList.contains('remove-item')) {
            cart = cart.filter(item => item.id !== id);
            renderCart();
        }
    });

    // Finalizar Pedido e Enviar para o WhatsApp
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            const phoneNumber = '5591989796664'; // Número do WhatsApp com código do país (55) e DDD (91)

            let message = "Olá, Breno! Meu pedido de Brownies é:\n\n";
            let totalAmount = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                message += `${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)} cada) = R$ ${itemTotal.toFixed(2)}\n`;
                totalAmount += itemTotal;
            });

            message += `\nTotal: R$ ${totalAmount.toFixed(2)}`;
            message += `\n\nPor favor, me informe sobre as opções de pagamento e entrega.`;

            // Codifica a mensagem para ser usada na URL
            const encodedMessage = encodeURIComponent(message);

            // Cria o link do WhatsApp
            const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

            // Abre o WhatsApp
            window.open(whatsappLink, '_blank');

            // Opcional: Limpar o carrinho após enviar o pedido
            cart = [];
            renderCart();

            alert('Pedido enviado para o WhatsApp! Aguarde a confirmação de Breno.');

        } else {
            alert('Seu carrinho está vazio! Adicione alguns brownies antes de finalizar.');
        }
    });

    // Renderiza o carrinho na primeira carga da página
    renderCart();
});