const mainSwiper = new Swiper(".product-gallery__main", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const thumbsSwiper = new Swiper(".product-gallery__thumbnails", {
  slidesPerView: 5,
  watchSlidesProgress: true,
});

mainSwiper.controller.control = thumbsSwiper;
thumbsSwiper.controller.control = mainSwiper;