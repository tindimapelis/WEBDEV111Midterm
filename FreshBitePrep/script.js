(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-site-nav]');
  const page = document.documentElement.getAttribute('data-page') || '';
  const hero = document.querySelector('[data-hero-carousel]');

  const heroSlides = [
    {
      chip: 'New week, new menu',
      title: 'Fresh meals that fit your goals.',
      text:
        'Choose from balanced weekly meals, then pair them with a diet plan tailored to your lifestyle. Simple ordering, clear billing, and food you will look forward to.',
      primaryLabel: 'Browse Weekly Meals',
      primaryHref: 'meals..html',
      secondaryLabel: 'Build Your Diet Plan',
      secondaryHref: 'dietplan.html',
      panelTitle: 'What you get',
      bullets: [
        'Weekly rotating menu with clear macros',
        'Diet plan options for common goals',
        'Simple billing and order history',
        'Support whenever you need it',
      ],
    },
    {
      chip: 'Built for busy weeks',
      title: 'Plan faster, eat better, stress less.',
      text:
        'Use the same Fresh Bite banner while flipping through quick highlights for meals, plans, and support. The image stays fixed while the message rotates.',
      primaryLabel: 'View This Week\'s Meals',
      primaryHref: 'meals..html',
      secondaryLabel: 'Contact Us',
      secondaryHref: 'contact.html',
      panelTitle: 'Why customers like it',
      bullets: [
        'Fast weekly ordering flow',
        'Clear plan and meal organization',
        'Helpful support for questions and allergies',
        'Simple pages you can keep expanding later',
      ],
    },
    {
      chip: 'From menu to checkout',
      title: 'One banner, multiple highlights.',
      text:
        'This carousel keeps the same hero image visible and only updates the text, links, and info card so the homepage feels dynamic without swapping graphics.',
      primaryLabel: 'Check Billing',
      primaryHref: 'billing.html',
      secondaryLabel: 'See Diet Plan',
      secondaryHref: 'dietplan.html',
      panelTitle: 'Homepage focus',
      bullets: [
        'Full above-the-fold image stays visible',
        'Carousel-style arrows and dots',
        'Buttons change with each highlight',
        'Works on desktop and mobile',
      ],
    },
  ];

  const setActive = () => {
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a[href]'));
    const normalized = page.trim();
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const isActive =
        normalized && (href === normalized || href.endsWith('/' + normalized));
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  };

  const setMenuState = (open) => {
    document.body.classList.toggle('nav-open', open);
    if (menuButton) menuButton.setAttribute('aria-expanded', String(open));
  };

  if (menuButton) {
    menuButton.addEventListener('click', () => {
      setMenuState(!document.body.classList.contains('nav-open'));
    });
  }

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('nav-open')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[data-site-nav]')) return;
    if (target.closest('[data-menu-button]')) return;
    setMenuState(false);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });

  const setupHeroCarousel = () => {
    if (!hero) return;

    const chip = hero.querySelector('[data-hero-chip]');
    const title = hero.querySelector('[data-hero-title]');
    const text = hero.querySelector('[data-hero-text]');
    const primary = hero.querySelector('[data-hero-primary]');
    const secondary = hero.querySelector('[data-hero-secondary]');
    const panelTitle = hero.querySelector('[data-hero-panel-title]');
    const list = hero.querySelector('[data-hero-list]');
    const prevButton = hero.querySelector('[data-hero-prev]');
    const nextButton = hero.querySelector('[data-hero-next]');
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));

    if (!chip || !title || !text || !primary || !secondary || !panelTitle || !list) return;

    let currentIndex = 0;

    const renderSlide = (index) => {
      const slide = heroSlides[index];
      if (!slide) return;

      chip.textContent = slide.chip;
      title.textContent = slide.title;
      text.textContent = slide.text;
      primary.textContent = slide.primaryLabel;
      primary.setAttribute('href', slide.primaryHref);
      secondary.textContent = slide.secondaryLabel;
      secondary.setAttribute('href', slide.secondaryHref);
      panelTitle.textContent = slide.panelTitle;
      list.innerHTML = slide.bullets.map((bullet) => `<li>${bullet}</li>`).join('');

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    };

    const moveTo = (index) => {
      currentIndex = (index + heroSlides.length) % heroSlides.length;
      renderSlide(currentIndex);
    };

    if (prevButton) prevButton.addEventListener('click', () => moveTo(currentIndex - 1));
    if (nextButton) nextButton.addEventListener('click', () => moveTo(currentIndex + 1));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => moveTo(index));
    });

    renderSlide(currentIndex);
  };

  setActive();
  setupHeroCarousel();
})();
