document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay to the animation
                entry.target.style.animationDelay = `${index * 150}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements with the class 'post-card'
    document.querySelectorAll('.post-card').forEach(card => {
        observer.observe(card);
    });
});
