// api/contact.js
import nodemailer from 'nodemailer';
import * as cookie from 'cookie';

// Simple in-memory rate limiting store
// In a production environment, consider using Redis or a similar data store
const rateLimit = {
  ipRequests: {},
  emailRequests: {},
  resetTime: Date.now(),
  windowMs: 3600000, // 1 hour in milliseconds
  maxRequestsPerIP: 10, // Max requests per IP address in the time window
  maxRequestsPerEmail: 3, // Max requests per email address in the time window
};

// Function to clean up old rate limit entries every hour
const cleanupRateLimits = () => {
  const now = Date.now();

  // If more than an hour has passed since last reset
  if (now - rateLimit.resetTime > rateLimit.windowMs) {
    rateLimit.ipRequests = {};
    rateLimit.emailRequests = {};
    rateLimit.resetTime = now;
  }
};

// Helper function to check rate limits
const checkRateLimit = (ip, email) => {
  // Clean up old entries first
  cleanupRateLimits();

  // Initialize if not exists
  rateLimit.ipRequests[ip] = rateLimit.ipRequests[ip] || 0;
  rateLimit.emailRequests[email] = rateLimit.emailRequests[email] || 0;

  // Check limits
  if (rateLimit.ipRequests[ip] >= rateLimit.maxRequestsPerIP) {
    return { limited: true, reason: 'IP address has sent too many requests. Please try again later.' };
  }

  if (rateLimit.emailRequests[email] >= rateLimit.maxRequestsPerEmail) {
    return { limited: true, reason: 'This email address has been used too many times. Please try again later.' };
  }

  // Increment counters
  rateLimit.ipRequests[ip] += 1;
  rateLimit.emailRequests[email] += 1;

  return { limited: false };
};

// Helper function to sanitize input
const sanitizeInput = (input) => {
  if (!input) return '';

  // Convert to string if it's not already
  const str = String(input);

  // Replace potentially dangerous characters with HTML entities
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default async function handler(req, res) {
  // Set CORS headers (ensure X-CSRF-Token is allowed)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust in production!
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // ---> CSRF Token Verification <---
    const cookies = cookie.parse(req.headers.cookie || '');
    const tokenFromCookie = cookies['__Host-csrf-token'];
    const tokenFromHeader = req.headers['x-csrf-token'];

    if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
      console.warn('CSRF Token validation failed.', {
        hasCookie: !!tokenFromCookie,
        hasHeader: !!tokenFromHeader,
        match: tokenFromCookie === tokenFromHeader,
      });
      return res.status(403).json({ error: 'Invalid CSRF Token' });
    }
    // ---> End CSRF Token Verification <---

    // Get client IP address
    const clientIP = req.headers['x-forwarded-for']
                    || req.headers['x-real-ip']
                    || req.connection.remoteAddress
                    || '0.0.0.0';

    const {
      name, email, phone, subject, message,
    } = req.body;

    // Simple validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    // Check rate limit before processing
    const rateLimitResult = checkRateLimit(clientIP, email);
    if (rateLimitResult.limited) {
      return res.status(429).json({
        error: 'Too many requests',
        message: rateLimitResult.reason,
      });
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // You'll need to set these in Vercel
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'info@wiseoxmedia.com',
      subject: `Wise Ox Contact Form: ${sanitizedSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Phone:</strong> ${sanitizedPhone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
      // Add a text version for email clients that don't support HTML
      text: `
        New Contact Form Submission
        ===========================
        Name: ${sanitizedName}
        Email: ${sanitizedEmail}
        Phone: ${sanitizedPhone || 'Not provided'}
        Subject: ${sanitizedSubject}
        
        Message:
        ${sanitizedMessage}
      `,
      // Add a reply-to header with the sender's email
      replyTo: sanitizedEmail,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    // Avoid exposing CSRF errors directly if caught here, general error is safer
    if (error.message === 'Invalid CSRF Token') { // Check if it was our CSRF error
      return res.status(403).json({ error: 'Invalid CSRF Token' });
    }
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
