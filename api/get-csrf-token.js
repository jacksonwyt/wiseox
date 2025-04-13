import crypto from 'crypto';
import * as cookie from 'cookie'; // Vercel might handle this, but being explicit is safer

export default function handler(req, res) {
  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Generate a secure random token
    const csrfToken = crypto.randomBytes(32).toString('hex');

    const isProduction = process.env.NODE_ENV === 'production';

    // Set the token in a secure, HttpOnly cookie
    // Using __Host- prefix for added security (requires Secure attribute and Path=/)
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // Use secure cookies in production
      path: '/',
      sameSite: 'Strict', // Most secure option
      maxAge: 3600, // Expires in 1 hour (adjust as needed)
    };

    // Important: Cookie name MUST start with __Host- if Secure and Path=/ are used.
    // Conditionally choose the cookie name based on the 'secure' flag
    const cookieName = isProduction ? '__Host-csrf-token' : 'csrf-token';

    res.setHeader('Set-Cookie', cookie.serialize(cookieName, csrfToken, cookieOptions));

    // Return the token in the response body as well
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
};
