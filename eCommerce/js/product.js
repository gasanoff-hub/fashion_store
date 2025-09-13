const items = document.querySelectorAll(".product-accordion__item");
const addBtn = document.querySelector('.btn-special-2');
const product = JSON.parse(localStorage.getItem("selectedProduct"));

items.forEach((item) => {
  item.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    items.forEach((i) => i.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

addBtn.addEventListener('click', () => {
  if (!product) return;

  const itemWasAdded = toggleCart(product);

  addBtn.textContent = itemWasAdded ? "Added!" : "Removed!";
  
  updateHeaderCartCount();
  
  location.href = '/html/bag.html';
});

if (product) {
  document.querySelector(".product-title").textContent = product.title;
  document.querySelector(".product-price").textContent = `$${product.price}`;

  const mainWrapper = document.querySelector(".product-gallery__main .swiper-wrapper");
  const thumbsWrapper = document.querySelector(".product-gallery__thumbnails .swiper-wrapper");

  mainWrapper.innerHTML = "";
  thumbsWrapper.innerHTML = "";

  product.image.forEach(src => {
    // Main Swiper
    const mainSlide = document.createElement("div");
    mainSlide.classList.add("swiper-slide");

    const mainImg = document.createElement("img");
    mainImg.src = src;
    mainImg.classList.add("product-gallery__img");
    
    mainSlide.appendChild(mainImg);
    mainWrapper.appendChild(mainSlide);

    // Thumbnail Swiper
    const thumbSlide = document.createElement("div");
    thumbSlide.classList.add("swiper-slide");

    const thumbImg = document.createElement("img");
    thumbImg.src = src;
    thumbImg.classList.add("product-gallery__thumbnail");

    thumbSlide.appendChild(thumbImg);
    thumbsWrapper.appendChild(thumbSlide);
  });

  const thumbsSwiper = new Swiper(".product-gallery__thumbnails", {
    spaceBetween: 10,
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    freeMode: true,
  });

  const mainSwiper = new Swiper(".product-gallery__main", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
  });

  const colorList = document.querySelector(".product-colors__list");
  colorList.innerHTML = "";
  product.color.forEach((color) => {
    const span = document.createElement("span");
    span.classList.add("product-colors__item");
    span.style.backgroundColor = color;
    colorList.appendChild(span);
  });
} else {
  console.error("ERROR 404 NOT FUND");
};