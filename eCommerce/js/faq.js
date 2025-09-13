const faqEl = {
    items: document.querySelectorAll('.faq-item'),
};

faqEl.items.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('open');
    });
});