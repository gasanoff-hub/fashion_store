const el = {
    searchIcon: document.querySelector('.icon-search'),
    searchInput: document.querySelector('.header-search__input'),
    searchWrapper: document.querySelector('.header-search'),
    resultsContainer: document.getElementById('searchResults')
};

// Search açıb bağlama
el.searchIcon.addEventListener('click', () => {
    el.searchWrapper.classList.toggle('open');
    if (el.searchWrapper.classList.contains('open')) {
        el.searchInput.focus();
    } else {
        document.body.style.overflow = ''; // scroll bərpa
        if (el.resultsContainer) el.resultsContainer.style.display = 'none';
    }
});

// Overlay xaricinə click → bağla
document.addEventListener('click', (e) => {
  if (!el.searchWrapper.contains(e.target) && !el.searchIcon.contains(e.target)) {
    el.searchWrapper.classList.remove('open');
    if (el.resultsContainer) el.resultsContainer.style.display = 'none';
    document.body.style.overflow = ''; // scroll bərpa
  }
});

async function fetchProducts() {
  const response = await fetch('../data/data.json');
  if (!response.ok) throw new Error("Data not found");
  return await response.json();
}

let allProducts = [];

el.searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  if (!el.resultsContainer) return;

  // Slide container yarat / seç
  const slideContainer = el.resultsContainer.querySelector('.fashion-slide-container') || (() => {
    const div = document.createElement('div');
    div.classList.add('fashion-slide-container');
    el.resultsContainer.appendChild(div);
    return div;
  })();

  slideContainer.innerHTML = '';
  el.resultsContainer.style.display = 'none';
  document.body.style.overflow = ''; // əvvəl scroll bərpa

  if (query.length < 2) return;

  if (allProducts.length === 0) {
    const data = await fetchProducts();
    allProducts = [
      ...data.women.clothing,
      ...data.women.bags,
      ...data.women.accessories,
      ...data.women.shoes,
      ...data.men.clothing,
      ...data.men.shoes,
      ...data.men.watch,
      ...data.men.accessories
    ];
  }

  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(query)
  );

  if (filtered.length > 0) {
    filtered.forEach(item => {
      const slide = document.createElement('div');
      slide.classList.add('fashion-slide');

      const img = document.createElement('img');
      img.src = item.image[0];
      img.alt = item.title;
      img.classList.add('fashion-slide__img');

      // Click → product page
      img.addEventListener('click', () => {
        localStorage.setItem('selectedProduct', JSON.stringify(item));
        location.href = '/html/product.html';
      });

      slide.appendChild(img);
      slideContainer.appendChild(slide);
    });

    el.resultsContainer.style.display = 'block';
    document.body.style.overflow = 'hidden'; // scroll lock yalnız nəticə varsa
  }
});