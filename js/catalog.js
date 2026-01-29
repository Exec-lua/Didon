// Catalog Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const catalogItems = document.querySelectorAll('.catalog-item');

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      catalogItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hide');
          // Add fade-in animation
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          }, 10);
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Smooth scroll for catalog items
  const catalogSection = document.querySelector('.catalog-section');


  // Initialize Lenis for smooth scrolling
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis();
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
  }
});

