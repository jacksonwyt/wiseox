export function createLogoScroller() {
  const logos = [
    { src: 'images/logos/MajesticPure_logo.png', alt: 'MajesticPure' },
    { src: 'images/logos/NexonBotanicals_logo.png', alt: 'Nexon Botanicals' },
    { src: 'images/logos/SoulSpa_logo.png', alt: 'SoulSpa' },
    { src: 'images/logos/Ganix_logo.png', alt: 'Ganix' },
    { src: 'images/logos/AlfiesChoice.png', alt: 'Alfies Choice' },
    { src: 'images/logos/MADO_logo.png', alt: 'MADO' },
    { src: 'images/logos/phrasly_logo.png', alt: 'Phrasly' },
    { src: 'images/logos/utopia_logo.png', alt: 'Utopia' },
  ];

  // Duplicate logos for seamless loop
  const allLogos = [...logos, ...logos];

  const logoSlides = allLogos.map(logo => `
    <div class="swiper-slide client-logo">
        <img src="${logo.src}" alt="${logo.alt}" loading="lazy">
    </div>
  `).join('');

  // Return only the inner Swiper structure
  return `
    <div class="swiper logo-swiper">
        <div class="swiper-wrapper">
            ${logoSlides}
        </div>
    </div>
  `;
}
