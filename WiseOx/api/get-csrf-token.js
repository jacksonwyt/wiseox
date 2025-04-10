const crypto = require('crypto');
const cookie = require('cookie'); // Vercel might handle this, but being explicit is safer

module.exports = (req, res) => {
  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Generate a secure random token
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Set the token in a secure, HttpOnly cookie
    // Using __Host- prefix for added security (requires Secure attribute and Path=/)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/',
      sameSite: 'Strict', // Most secure option
      maxAge: 3600, // Expires in 1 hour (adjust as needed)
    };

    // Important: Cookie name MUST start with __Host- if Secure and Path=/ are used.
    res.setHeader('Set-Cookie', cookie.serialize('__Host-csrf-token', csrfToken, cookieOptions));

    // Return the token in the response body as well
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
};
