document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const catalogItems = document.querySelectorAll('.catalog-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      catalogItems.forEach(item => {
        const match =
          filter === 'all' ||
          item.getAttribute('data-category') === filter;

        if (match) {
          item.classList.remove('hide');
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          });
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
});
