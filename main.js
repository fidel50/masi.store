// Base de datos de productos (30 productos)
const products = [
    {
        id: 1,
        name: "Arete corazon",
        description: " Corazones dorados que conquistan miradas. Estos aretes con diseño de corazón brillante son el regalo perfecto para demostrar amor. Acabado premium, estilo único. ¡Ideal para San Valentín o cualquier ocasión especial! Precio increíble que no puedes rechazar.",
        price: 5,
        category: "Aretes",
        image: "imagenes/arete2.jpg",
        stock: 12,
        isNew: true
    },
    {
        id: 2,
        name: "Anillo nudo",
        description: "Elegancia atemporal en tus manos. Este anillo plateado con diseño de nudo simboliza amor eterno. Acabado brillante, calidad premium. Perfecto para regalar o consentirte. ¡Destaca con estilo único que nunca pasa de moda!",
        price: 5,
        category: "Anillos",
        image: "imagenes/anillo2.jpg",
        stock: 10
    },
    {
        id: 3,
        name: "Manilla cristal",
        description: "Brillo que enamora a primera vista. Esta manilla dorada con cristal central irradia elegancia y sofisticación. Diseño versátil para cualquier ocasión. Calidad premium que resalta tu estilo único. ¡El accesorio perfecto que complementará todos tus looks!",
        price: 10,
        category: "Manillas",
        image: "imagenes/manilla1.jpg",
        stock: 12
    },
    {
        id: 4,
        name: "Llavero snoopy",
        description: "¡Lleva a Snoopy contigo siempre! Este adorable llavero artesanal captura la ternura de tu personaje favorito. Calidad premium, diseño único y ese toque de nostalgia que enamora. ¡Perfecto regalo para fans de todas las edades!",
        price: 10,
        category: "Llaveros",
        image: "imagenes/llavero1.jpg",
        stock: 12 
    },
     {
        id: 5,
        name: "Llavero Stich",
        description: "Lleva contigo la ternura de Stitch en un llavero irresistible, colorido y coleccionable que roba miradas, transmite alegría y convierte cada detalle cotidiano en un toque único de magia.",
        price: 10,
        category: "Llaveros",
        image: "imagenes/stich.jpg",
        stock: 12 
    },
];

// Carrito de compras
let cart = [];
const SHIPPING_COST = 0;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
    createWhatsAppButton();
});

// Crear botón flotante de WhatsApp
function createWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = "https://wa.me/59167185356?text=Hola MaSi.Store, tengo una consulta sobre sus accesorios";
    whatsappBtn.className = "whatsapp-float";
    whatsappBtn.target = "_blank";
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.title = "Consulta por WhatsApp";
    document.body.appendChild(whatsappBtn);
}

// Renderizar productos en el catálogo
function renderProducts(productsToRender) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No se encontraron productos</h4>
                <p class="text-muted">Intenta con otros términos de búsqueda o categorías.</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const stockClass = product.stock < 10 ? 'stock-low' : 'stock-available';
        const stockText = product.stock < 10 ? `Stock: ${product.stock} (Bajo)` : `Stock: ${product.stock}`;
        const newBadge = product.isNew ? '<span class="badge-new">Nuevo</span>' : '';
        
        const productCard = `
            <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div class="card product-card h-100">
                    ${newBadge}
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
                    <div class="card-body d-flex flex-column">
                        <span class="product-category">${getCategoryName(product.category)}</span>
                        <h5 class="product-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="product-price">Bs. ${product.price.toFixed(2)}</div>
                            <div class="small ${stockClass}">${stockText}</div>
                        </div>
                        <button class="btn btn-add-to-cart mt-3" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-2"></i>${product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
    
    // Añadir event listeners a los botones de carrito
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Buscador
    document.getElementById('searchButton').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') searchProducts();
    });
    
    // Filtros por categoría
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Filtrar productos
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
    
    // Carrito
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', startCheckout);
    
    // Modal de contacto
    document.getElementById('confirmOrderBtn').addEventListener('click', confirmOrder);
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Filtrar productos por categoría
function filterProductsByCategory(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Buscar productos
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterProductsByCategory(activeCategory);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        getCategoryName(product.category).toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
}

// Añadir producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Verificar stock
    if (product.stock === 0) {
        alert(`Lo sentimos, ${product.name} está agotado.`);
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        // Verificar stock disponible
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`);
            return;
        }
    } else {
        // Añadir nuevo producto al carrito
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            stock: product.stock
        });
    }
    
    updateCart();
    showNotification(`${product.name} añadido al carrito`);
}

// Actualizar carrito
function updateCart() {
    updateCartCount();
    renderCartItems();
    calculateCartTotal();
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Renderizar items del carrito
function renderCartItems() {
    const container = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center" id="emptyCartMessage">Tu carrito está vacío</p>';
        cartSummary.classList.add('d-none');
        return;
    }
    
    cartSummary.classList.remove('d-none');
    container.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItem = `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${item.image}" class="cart-item-img" alt="${item.name}" 
                             onerror="this.src='https://via.placeholder.com/60x60?text=Imagen'">
                    </div>
                    <div class="col-6">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="small text-muted">Bs. ${item.price.toFixed(2)} c/u</div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary btn-decrease" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary btn-increase" data-id="${item.id}" ${item.quantity >= item.stock ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-3 text-end">
                        <div class="cart-item-price">Bs. ${itemTotal.toFixed(2)}</div>
                        <button class="btn btn-sm btn-outline-danger mt-2 btn-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItem;
    });
    
    // Añadir event listeners a los botones del carrito
    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Actualizar cantidad de un item en el carrito
function updateCartItemQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // Verificar stock
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
        alert(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`);
        return;
    }
    
    cartItem.quantity = newQuantity;
    updateCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Calcular total del carrito
function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = subtotal > 500 ? subtotal * 0.1 : 0; // 10% de descuento si el subtotal es mayor a 500 Bs.
    const total = subtotal - discount + SHIPPING_COST;
    
    document.getElementById('cartSubtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = `Bs. ${SHIPPING_COST.toFixed(2)}`;
    document.getElementById('cartDiscount').textContent = `Bs. ${discount.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `Bs. ${total.toFixed(2)}`;
}

// Mostrar/ocultar carrito
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('show');
}

// Vaciar carrito
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        updateCart();
        showNotification('Carrito vaciado');
    }
}

// Iniciar proceso de compra
function startCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Mostrar modal para datos de contacto
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    contactModal.show();
}

// Confirmar pedido y abrir WhatsApp
function confirmOrder() {
    // Validar formulario
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    //const address = document.getElementById('customerAddress').value;
    const email = document.getElementById('customerEmail').value || 'No especificado';
    //const notes = document.getElementById('customerNotes').value || 'Sin notas adicionales';
    const deliveryOptions = document.querySelectorAll('input[name="deliveryPoint"]');
    const selectedDeliveryPoint = document.getElementById('selectedDeliveryPoint');
    const recojo="";
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function () {
            selectedDeliveryPoint.textContent = "Elegiste: " + this.value;
            recojo = this.value; // aquí puedes usar el valor
        });
    });
    
    if (!name || !phone || !recojo) {
        alert('Por favor completa todos los campos obligatorios (*)');
        return;
    }
    
    
    
    // Calcular total
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = subtotal > 500 ? subtotal * 0.1 : 0;
    const total = subtotal - discount + SHIPPING_COST;
    
    // Generar número de pedido
    const orderNumber = 'MS-' + Date.now().toString().slice(-6);
    
    // Construir mensaje de WhatsApp
    let whatsappMessage = `¡Hola Magi.Store! \n\n`;
    whatsappMessage += `*NUEVO PEDIDO - ${orderNumber}*\n\n`;
    whatsappMessage += `*DATOS DEL CLIENTE:*\n`;
    whatsappMessage += `• Nombre: ${name}\n`;
    whatsappMessage += `• Teléfono: ${phone}\n`;
    whatsappMessage += `• Correo: ${email}\n`;
    whatsappMessage += `• Punto de Recojo: ${recojo}\n\n`;
    //whatsappMessage += `• Dirección: ${address}\n`;
    //whatsappMessage += `• Lugar de Recojo: ${notes}\n\n`;
    
    whatsappMessage += `*PRODUCTOS PEDIDOS:*\n`;
    cart.forEach((item, index) => {
        whatsappMessage += `${index + 1}. ${item.name}\n`;
        whatsappMessage += `   Cantidad: ${item.quantity}\n`;
        whatsappMessage += `   Precio unitario: Bs. ${item.price.toFixed(2)}\n`;
        whatsappMessage += `   Subtotal: Bs. ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    whatsappMessage += `*RESUMEN DE PAGO:*\n`;
    whatsappMessage += `• Subtotal: Bs. ${subtotal.toFixed(2)}\n`;
    if (discount > 0) {
        whatsappMessage += `• Descuento (10%): Bs. ${discount.toFixed(2)}\n`;
    }
    whatsappMessage += `• Costo de envío o Recojo: Bs. ${SHIPPING_COST.toFixed(2)}\n`;
    whatsappMessage += `• *TOTAL A PAGAR: Bs. ${total.toFixed(2)}*\n\n`;
    
    whatsappMessage += `*INSTRUCCIONES:*\n`;
    whatsappMessage += `1. Realize el pago al Codigo QR que le enviaremos\n`;
    whatsappMessage += `2. Se coordinara el dia de entrega en el grupo - Unase por Favor\n`;
    whatsappMessage += `3. Muchas gracias por su compra.\n\n`;
    
    whatsappMessage += ` *Fecha y hora:* ${new Date().toLocaleString('es-BO')}\n`;
    whatsappMessage += ` *Número de pedido:* ${orderNumber}`;
    
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Número de WhatsApp
    const whatsappNumber = "59167185356"; 
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Mostrar confirmación antes de abrir WhatsApp
    const confirmationHTML = `
        <div class="alert alert-success text-center">
            <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h5>¡Pedido Listo para Enviar!</h5>
            <p>Se abrirá WhatsApp para que envíes tu pedido automáticamente.</p>
            <p><strong>Número de Pedido: ${orderNumber}</strong></p>
            
            <div class="order-summary mt-3">
                <h6>Resumen del Pedido:</h6>
                <p><strong>Cliente:</strong> ${name}</p>
                <p><strong>Total:</strong> Bs. ${total.toFixed(2)}</p>
                <p><strong>Productos:</strong> ${cart.length} diferentes</p>
            </div>
            
            <div class="qr-container">
                <p class="small text-muted mb-2">También puedes escanear este código para contacto rápido:</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/${whatsappNumber}?text=Consulta%20Bolivia%20Robotics&color=1a237e&bgcolor=f5f5f5" 
                     alt="QR WhatsApp">
                <p class="small text-muted mt-2">Escanea para contactarnos</p>
            </div>
            
            <hr>
            <div class="d-grid gap-2 mt-3">
                <a href="${whatsappURL}" class="btn btn-success btn-lg" target="_blank" id="openWhatsAppBtn">
                    <i class="fab fa-whatsapp me-2"></i>Abrir WhatsApp y Enviar Pedido
                </a>
                <button class="btn btn-outline-primary" id="copyOrderBtn">
                    <i class="fas fa-copy me-2"></i>Copiar Información del Pedido
                </button>
                <button class="btn btn-outline-secondary" id="closeConfirmationBtn">
                    <i class="fas fa-times me-2"></i>Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Reemplazar contenido del carrito con confirmación
    document.getElementById('cartItems').innerHTML = confirmationHTML;
    document.getElementById('cartSummary').classList.add('d-none');
    
    // Botón para copiar información del pedido
    document.getElementById('copyOrderBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(whatsappMessage.replace(/\*/g, ''))
            .then(() => {
                showNotification('Información del pedido copiada al portapapeles', 'info');
            })
            .catch(() => {
                alert('No se pudo copiar la información. Por favor, ábrelo en WhatsApp.');
            });
    });
    
    // Botón para cerrar confirmación
    document.getElementById('closeConfirmationBtn').addEventListener('click', function() {
        // Vaciar carrito
        cart = [];
        updateCart();
        toggleCart();
        
        // Volver a vista normal del carrito
        renderCartItems();
        calculateCartTotal();
        document.getElementById('cartSummary').classList.remove('d-none');
        document.getElementById('checkoutBtn').textContent = 'Continuar con la Compra';
        document.getElementById('checkoutBtn').removeEventListener('click', startCheckout);
        document.getElementById('checkoutBtn').addEventListener('click', startCheckout);
    });
    
    // Cerrar modal
    const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    contactModal.hide();
    
    // Limpiar formulario
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerNotes').value = '';
    
    // Mostrar notificación
    showNotification('Pedido preparado. Se abrirá WhatsApp en 3 segundos...', 'info');
    
    // Abrir WhatsApp después de 3 segundos
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 3000);
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1100;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Obtener nombre legible de la categoría
function getCategoryName(category) {
    const categories = {
        'arduino': 'Arduino',
        'sensores': 'Sensores',
        'motores': 'Motores',
        'kits': 'Kits',
        'raspberry': 'Raspberry Pi',
        'modulos': 'Módulos',
        'herramientas': 'Herramientas',
        'otros': 'Otros Componentes'
    };
    
    return categories[category] || category;
}

// Añadir animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
