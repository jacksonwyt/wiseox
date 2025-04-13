export function createNavbar(currentPage) {
  const navItems = [
    { name: 'Home', href: 'index.html', id: 'home' },
    { name: 'Case Studies', href: 'case-studies.html', id: 'case-studies' },
    { name: 'Contact', href: 'contact.html', id: 'contact' },
  ];

  const listItems = navItems.map(item => `
    <li><a href="${item.href}"${currentPage === item.id ? ' class="active"' : ''}>${item.name}</a></li>
  `).join('');

  // Add navbar-home class only if on the homepage
  const navbarClass = currentPage === 'home' ? 'navbar navbar-home' : 'navbar';

  return `
    <nav class="${navbarClass}">
        <div class="container">
            <a href="index.html" class="logo">
                <img src="images/wiseox_logo.png" alt="Wise Ox">
            </a>
            
            <ul class="nav-menu">
                ${listItems}
            </ul>
            
            <div class="mobile-menu-btn" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </nav>
  `;
}
