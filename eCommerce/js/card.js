const updateHeaderWishlistCount = () => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const heartSpan = document.querySelector('.header__actions--item .header__actions--span');

  if(heartSpan) {
    heartSpan.textContent = wishlist.length;
  }
};

const toggleWishlist = (item) => {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const index = wishlist.findIndex(product => product.id === item.id);

  if (index === -1) {
    wishlist.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return true;
  } else {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return false;
  }
};

const updateHeaderCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartSpan = document.querySelector('.header__actions--item .cart-span');

  if(cartSpan) cartSpan.textContent = cart.length;
};

const toggleCart = (item) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!Array.isArray(cart)) cart = [];

  const index = cart.findIndex(product => product.id === item.id);

  if (index === -1) {
    item.quantity = 1;
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    return true;
  }
  else {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    return false;
  }
};

const updateOrderSummary = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const subtotalEl = document.querySelector('.order-summary__row .order-summary__subtotal');
  const shippingEl = document.querySelector('.order-summary__row .order-summary__shipping');
  const totalEl = document.querySelector('.order-summary__row--total .order-summary__value');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const shipping = 10;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
};

const updateCartQuantity = (id, delta) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].quantity = (cart[index].quantity || 1) + delta;

    if (cart[index].quantity < 1) {
      cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateHeaderCartCount();
  }
};

const createCard = (items, containerId, isWishlist = false, hideAddIcon = false) => {
  const container = document.getElementById(containerId) || document.querySelector(containerId);
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const isBagPage = location.pathname.includes('bag.html');

  items.forEach(item => {
    const slide = document.createElement('div');
    slide.classList.add('fashion-slide');

    const img = document.createElement('img');
    img.src = item.image[0];
    img.classList.add('fashion-slide__img');
    img.addEventListener('click', () => {
      localStorage.setItem('selectedProduct', JSON.stringify(item));
      location.href = '/html/product.html';
    });
    slide.appendChild(img);

    const heartIcon = document.createElement('i');
    heartIcon.className = "icon icon-heart fashion-icon__heart ri-heart-fill";
    heartIcon.dataset.id = item.id;

    if (wishlist.some(product => product.id === item.id)) heartIcon.classList.add('active');

    heartIcon.addEventListener('click', () => {
      if (isBagPage) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = wishlist.some(product => product.id === item.id);

        if (!exists) {
          wishlist.push(item);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          updateHeaderWishlistCount();
        }

        heartIcon.classList.toggle('active', true);
        return;
      }

      const itemWasAdded = toggleWishlist(item);
      heartIcon.classList.toggle('active', itemWasAdded);

      if (!itemWasAdded && isWishlist) slide.remove();
      updateHeaderWishlistCount();
    });

    slide.appendChild(heartIcon);

    if(!hideAddIcon) {
      const addIcon = document.createElement('i');
      addIcon.className = "icon icon-add fashion-icon__add ri-add-line";
      addIcon.dataset.id = item.id;

      addIcon.addEventListener('click', () => {
      const itemWasAdded = toggleCart(item);
      addIcon.classList.toggle('active', itemWasAdded);
      updateHeaderCartCount();

      const bagContainer = document.querySelector('.bag__items');
      if (bagContainer && itemWasAdded && !bagContainer.querySelector(`[data-id="${item.id}"]`)) {
        createCard(item, bagContainer, true);
      }

      if (itemWasAdded) {
        location.href = '/html/bag.html';
      }
    });

      slide.appendChild(addIcon);
    }

    const colorDiv = document.createElement('div');
    colorDiv.classList.add('fashion-slide__color');

    const colorName = document.createElement('span');
    colorName.classList.add('fashion-color__name');
    colorName.textContent = item.color[0] || '';

    colorDiv.appendChild(colorName);

    const dotPattern = document.createElement('div');
    dotPattern.classList.add('dot-pattern');

    item.color.forEach((color, index) => {
      const dot = document.createElement('div');
      dot.classList = `dot ${color}` ;
      dotPattern.appendChild(dot);
    });

    colorDiv.appendChild(dotPattern);
    slide.appendChild(colorDiv);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('fashion-slide__info');

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('fashion-slide__title');
    titleSpan.textContent = item.title;

    const priceSpan = document.createElement('span');
    priceSpan.classList.add('fashion-slide__price');
    priceSpan.innerHTML = `<span translate="no">$</span>${item.price}`;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(priceSpan);
    slide.appendChild(infoDiv);

    if (isBagPage) {
      const quantityWrapper = document.createElement('div');
      quantityWrapper.className = 'quantity-wrapper';

      const minusBtn = document.createElement('button');
      minusBtn.textContent = '-';
      minusBtn.className = 'quantity-btn';

      const quantitySpan = document.createElement('span');
      quantitySpan.textContent = item.quantity || 1;
      quantitySpan.className = 'quantity-value';

      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.className = 'quantity-btn';

      quantityWrapper.appendChild(minusBtn);
      quantityWrapper.appendChild(quantitySpan);
      quantityWrapper.appendChild(plusBtn);

      plusBtn.addEventListener('click', () => {
        updateCartQuantity(item.id, 1);
        renderCart();
      });

      minusBtn.addEventListener('click', () => {
        updateCartQuantity(item.id, -1);
        renderCart();
      });

      slide.appendChild(quantityWrapper);
    }

    container.appendChild(slide);
  });
};

const renderWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistContainer = document.querySelector(".wishlist__items");

  wishlistContainer.innerHTML = "";
  createCard(wishlist, ".wishlist__items", true);

  updateHeaderWishlistCount();
};

const renderCart = () => {
  const cartContainer = document.querySelector('.bag__items');
  const orderSummary = document.querySelector('.bag__order-summary');
  if (!cartContainer) return;

  cartContainer.innerHTML = '';
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    if (orderSummary) orderSummary.style.display = 'none';
  } else {
    if (orderSummary) orderSummary.style.display = 'flex';

    createCard(cart, '.bag__items', true, true);
    updateHeaderCartCount();
    updateOrderSummary();
  }
};

const loadFashion = async () => {
  try {
    const response = await fetch('../data/data.json');

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (document.getElementById("women-clothing-slider")) {
      createCard(data.women.clothing, "women-clothing-slider");
      createCard(data.women.bags, "women-bags-slider");
      createCard(data.women.accessories, "women-accessories-slider");
      createCard(data.women.shoes, "women-shoes-slider");
    }

    if (document.getElementById("men-clothing-slider")) {
      createCard(data.men.clothing, "men-clothing-slider");
      createCard(data.men.shoes, "men-shoes-slider");
      createCard(data.men.watch, "men-watch-slider");
      createCard(data.men.accessories, "men-accessories-slider");
    }

    if (document.querySelector(".wishlist__items")) renderWishlist();
    if (document.querySelector(".bag__items")) renderCart();

    updateHeaderWishlistCount();
    updateHeaderCartCount();
  } catch (error) {
    console.log('ERROR 404', error)
  }
}

loadFashion();