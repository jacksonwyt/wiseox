export function createFooter() {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <div class="footer-logo">
                        <img src="images/wiseox_logo.png" alt="Wise Ox">
                    </div>
                    <p>Innovative digital marketing solutions for businesses seeking growth and success in the digital landscape.</p>
                </div>
                
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="case-studies.html">Case Studies</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-contact">
                    <h3>Contact Us</h3>
                    <ul>
                        <li><i class="fas fa-map-marker-alt"></i> PO Box 5000 PMB 60 Rancho Santa Fe, CA 92067</li>
                        <li><i class="fas fa-phone"></i> 858.705.7516</li>
                        <li><i class="fas fa-envelope"></i> info@wiseoxmedia.com</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; ${currentYear} Wise Ox. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scroll to top button -->
    <div class="scroll-top">
        <i class="fas fa-arrow-up"></i>
    </div>
  `;
}
